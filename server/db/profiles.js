const pool = require("./pool");
const { toProfile } = require("./mappers");

async function getStatus(userId) {
    const result = await pool.query("SELECT status FROM users WHERE id = $1", [userId]);
    return result.rows[0] ? result.rows[0].status : undefined;
}

async function setStatus(userId, status) {
    await pool.query("UPDATE users SET status = $1 WHERE id = $2", [status, userId]);
}

async function getProfile(userId, viewerId = null) {
    const result = await pool.query(
        `SELECT p.*, u.photo_small, u.photo_large,
                EXISTS (
                    SELECT 1 FROM follows f
                    WHERE f.follower_id = $2 AND f.followed_id = p.user_id
                ) AS followed,
                EXISTS (
                    SELECT 1 FROM follows f
                    WHERE f.follower_id = p.user_id AND f.followed_id = $2
                ) AS follows_me
         FROM profiles p
         JOIN users u ON u.id = p.user_id
         WHERE p.user_id = $1`,
        [userId, viewerId]
    );
    return result.rows[0] ? toProfile(result.rows[0]) : null;
}

async function saveProfile(userId, data) {
    const current = await getProfile(userId);
    if (!current) return false;
    const fullName = data.fullName != null ? data.fullName : current.fullName;
    const aboutMe = data.aboutMe != null ? data.aboutMe : current.aboutMe;
    const lookingForAJob = data.lookingForAJob != null ? Boolean(data.lookingForAJob) : current.lookingForAJob;
    const lookingForAJobDescription = data.lookingForAJobDescription != null
        ? data.lookingForAJobDescription
        : current.lookingForAJobDescription;
    const contacts = { ...current.contacts, ...(data.contacts || {}) };
    await pool.query(
        `UPDATE profiles SET
            full_name = $2,
            about_me = $3,
            looking_for_a_job = $4,
            looking_for_a_job_description = $5,
            facebook = $6,
            website = $7,
            vk = $8,
            twitter = $9,
            instagram = $10,
            youtube = $11,
            github = $12,
            main_link = $13
         WHERE user_id = $1`,
        [
            userId,
            fullName,
            aboutMe,
            lookingForAJob,
            lookingForAJobDescription,
            contacts.facebook,
            contacts.website,
            contacts.vk,
            contacts.twitter,
            contacts.instagram,
            contacts.youtube,
            contacts.github,
            contacts.mainLink,
        ]
    );
    await pool.query("UPDATE users SET name = $2 WHERE id = $1", [userId, fullName]);
    return true;
}

async function savePhoto(userId, photoUrl) {
    const result = await pool.query(
        "UPDATE users SET photo_small = $2, photo_large = $2 WHERE id = $1",
        [userId, photoUrl]
    );
    return result.rowCount > 0;
}

module.exports = { getStatus, setStatus, getProfile, saveProfile, savePhoto };
