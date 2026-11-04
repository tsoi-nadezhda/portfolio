const pool = require("./pool");

async function getPosts(userId, viewerId) {
    const result = await pool.query(
        `SELECT p.id, p.message, p.like_count,
                CASE WHEN $2::int IS NULL THEN false
                     ELSE EXISTS (
                         SELECT 1 FROM post_likes l
                         WHERE l.post_id = p.id AND l.user_id = $2
                     )
                END AS liked
         FROM posts p
         WHERE p.user_id = $1
         ORDER BY p.id`,
        [userId, viewerId]
    );
    return result.rows.map((row) => ({
        id: row.id,
        message: row.message,
        likeCount: row.like_count,
        liked: row.liked,
    }));
}

async function addPost(userId, message) {
    const result = await pool.query(
        `INSERT INTO posts (user_id, message, like_count)
         VALUES ($1, $2, 0)
         RETURNING id, message, like_count`,
        [userId, message]
    );
    const row = result.rows[0];
    return { id: row.id, message: row.message, likeCount: row.like_count, liked: false };
}

async function toggleLike(profileUserId, postId, likerId) {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        const post = await client.query(
            "SELECT id FROM posts WHERE id = $1 AND user_id = $2 FOR UPDATE",
            [postId, profileUserId]
        );
        if (post.rowCount === 0) {
            await client.query("ROLLBACK");
            return null;
        }
        const existing = await client.query(
            "SELECT 1 FROM post_likes WHERE post_id = $1 AND user_id = $2",
            [postId, likerId]
        );
        const liked = existing.rowCount === 0;
        if (liked) {
            await client.query(
                "INSERT INTO post_likes (post_id, user_id) VALUES ($1, $2)",
                [postId, likerId]
            );
        } else {
            await client.query(
                "DELETE FROM post_likes WHERE post_id = $1 AND user_id = $2",
                [postId, likerId]
            );
        }
        const updated = await client.query(
            `UPDATE posts
             SET like_count = GREATEST(like_count + $2, 0)
             WHERE id = $1
             RETURNING like_count`,
            [postId, liked ? 1 : -1]
        );
        await client.query("COMMIT");
        return { id: postId, likeCount: updated.rows[0].like_count, liked };
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}

async function deletePost(userId, postId) {
    const result = await pool.query(
        "DELETE FROM posts WHERE id = $1 AND user_id = $2",
        [postId, userId]
    );
    return result.rowCount > 0;
}

module.exports = { getPosts, addPost, toggleLike, deletePost };
