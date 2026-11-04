const pool = require("./pool");
const { toUser, userSelect } = require("./mappers");

async function getUsers(limit, page, currentUserId) {
    const offset = (page - 1) * limit;
    const [list, total] = await Promise.all([
        pool.query(
            `${userSelect}
             WHERE u.email_verified AND ($1::int IS NULL OR u.id <> $1)
             ORDER BY u.sort_order
             LIMIT $2 OFFSET $3`,
            [currentUserId, limit, offset]
        ),
        pool.query(
            "SELECT COUNT(*)::int AS count FROM users WHERE email_verified AND ($1::int IS NULL OR id <> $1)",
            [currentUserId]
        ),
    ]);
    return {
        items: list.rows.map(toUser),
        totalCount: total.rows[0].count,
        error: null,
    };
}

async function findUser(userId) {
    const result = await pool.query("SELECT id FROM users WHERE id = $1", [userId]);
    return result.rows[0] || null;
}

async function followUser(followerId, followedId) {
    await pool.query(
        `INSERT INTO follows (follower_id, followed_id) VALUES ($1, $2)
         ON CONFLICT DO NOTHING`,
        [followerId, followedId]
    );
}

async function unfollowUser(followerId, followedId) {
    await pool.query(
        "DELETE FROM follows WHERE follower_id = $1 AND followed_id = $2",
        [followerId, followedId]
    );
}

async function getRelations(userId) {
    const [friends, following, followers] = await Promise.all([
        pool.query(
            `${userSelect}
             WHERE EXISTS (
                 SELECT 1 FROM follows out_f
                 WHERE out_f.follower_id = $1 AND out_f.followed_id = u.id
             )
             AND EXISTS (
                 SELECT 1 FROM follows in_f
                 WHERE in_f.follower_id = u.id AND in_f.followed_id = $1
             )
             ORDER BY u.name`,
            [userId]
        ),
        pool.query(
            `${userSelect}
             WHERE EXISTS (
                 SELECT 1 FROM follows f
                 WHERE f.follower_id = $1 AND f.followed_id = u.id
             )
             ORDER BY u.name`,
            [userId]
        ),
        pool.query(
            `${userSelect}
             WHERE EXISTS (
                 SELECT 1 FROM follows f
                 WHERE f.follower_id = u.id AND f.followed_id = $1
             )
             ORDER BY u.name`,
            [userId]
        ),
    ]);
    return {
        friends: friends.rows.map(toUser),
        following: following.rows.map(toUser),
        followers: followers.rows.map(toUser),
    };
}

module.exports = { getUsers, findUser, followUser, unfollowUser, getRelations };
