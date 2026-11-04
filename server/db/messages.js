const pool = require("./pool");

async function getDialogs(userId) {
    const result = await pool.query(
        `SELECT u.id, u.name, u.photo_small, last.body AS last_message
         FROM users u
         LEFT JOIN LATERAL (
             SELECT body, id
             FROM messages m
             WHERE (m.sender_id = $1 AND m.receiver_id = u.id)
                OR (m.sender_id = u.id AND m.receiver_id = $1)
             ORDER BY m.id DESC
             LIMIT 1
         ) last ON true
         WHERE u.id <> $1
           AND (
             last.id IS NOT NULL
             OR (
               EXISTS (SELECT 1 FROM follows f WHERE f.follower_id = $1 AND f.followed_id = u.id)
               AND EXISTS (SELECT 1 FROM follows f WHERE f.follower_id = u.id AND f.followed_id = $1)
             )
           )
         ORDER BY last.id DESC NULLS LAST, u.name`,
        [userId]
    );
    return result.rows.map((row) => ({
        id: row.id,
        name: row.name,
        photo: row.photo_small,
        lastMessage: row.last_message,
    }));
}

async function getMessages(userId, otherUserId) {
    const person = await pool.query("SELECT id, name, status FROM users WHERE id = $1", [otherUserId]);
    if (person.rowCount === 0 || userId === otherUserId) return null;
    await pool.query(
        `UPDATE messages SET viewed = TRUE
         WHERE sender_id = $2 AND receiver_id = $1 AND viewed = FALSE`,
        [userId, otherUserId]
    );
    const result = await pool.query(
        `SELECT id, sender_id, body, viewed
         FROM messages
         WHERE (sender_id = $1 AND receiver_id = $2)
            OR (sender_id = $2 AND receiver_id = $1)
         ORDER BY id`,
        [userId, otherUserId]
    );
    return {
        messages: result.rows.map((row) => ({
            id: row.id,
            message: row.body,
            me: row.sender_id === userId,
            viewed: row.viewed,
        })),
        user: {
            id: person.rows[0].id,
            name: person.rows[0].name,
            status: person.rows[0].status || "",
        },
    };
}

async function addMessage(senderId, receiverId, body) {
    const user = await pool.query("SELECT id FROM users WHERE id = $1", [receiverId]);
    if (user.rowCount === 0 || senderId === receiverId) return null;
    const result = await pool.query(
        `INSERT INTO messages (sender_id, receiver_id, body)
         VALUES ($1, $2, $3)
         RETURNING id, body`,
        [senderId, receiverId, body]
    );
    return { id: result.rows[0].id, message: result.rows[0].body, me: true, viewed: false };
}

async function deleteMessage(userId, messageId) {
    const result = await pool.query(
        "DELETE FROM messages WHERE id = $1 AND sender_id = $2 RETURNING receiver_id",
        [messageId, userId]
    );
    if (result.rowCount === 0) return null;
    return { userId: result.rows[0].receiver_id };
}

module.exports = { getDialogs, getMessages, addMessage, deleteMessage };
