// Аккаунты, подтверждение email и сессии.
const crypto = require("crypto");
const pool = require("./pool");
const { hashPassword, verifyPassword, isHashed } = require("../password");

async function createAccount(name, email, password) {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        const existing = await client.query(
            "SELECT id, email_verified FROM users WHERE email = $1",
            [email]
        );
        const login = email.split("@")[0];
        if (existing.rowCount > 0) {
            if (existing.rows[0].email_verified) {
                await client.query("ROLLBACK");
                return { error: "This email is already registered" };
            }
            const id = existing.rows[0].id;
            await client.query(
                "UPDATE users SET name = $2, password = $3, login = $4, email_verified = FALSE WHERE id = $1",
                [id, name, hashPassword(password), login]
            );
            await client.query("UPDATE profiles SET full_name = $2 WHERE user_id = $1", [id, name]);
            await client.query("COMMIT");
            return { id, email, login, name };
        }
        const ids = await client.query(
            "SELECT COALESCE(MAX(id), 0) + 1 AS id, COALESCE(MAX(sort_order), 0) + 1 AS sort_order FROM users"
        );
        const id = ids.rows[0].id;
        await client.query(
            `INSERT INTO users (id, sort_order, name, status, email, password, login, email_verified)
             VALUES ($1, $2, $3, '', $4, $5, $6, FALSE)`,
            [id, ids.rows[0].sort_order, name, email, hashPassword(password), login]
        );
        await client.query(
            "INSERT INTO profiles (user_id, looking_for_a_job, full_name) VALUES ($1, FALSE, $2)",
            [id, name]
        );
        await client.query("COMMIT");
        return { id, email, login, name };
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}

const DUMMY_HASH = hashPassword("dummy-password");

async function findAccount(email, password) {
    const result = await pool.query(
        "SELECT id, email, login, password, email_verified FROM users WHERE email = $1",
        [email]
    );
    const row = result.rows[0];
    // Проверяем хеш и при отсутствии пользователя, чтобы не выдавать наличие email по времени ответа.
    const valid = verifyPassword(password, row ? row.password : DUMMY_HASH);
    return row && valid
        ? { id: row.id, email: row.email, login: row.login, emailVerified: row.email_verified }
        : null;
}

async function saveConfirmation(userId, code, token) {
    await pool.query(
        `INSERT INTO email_confirmations (user_id, code, token, expires_at, attempts)
         VALUES ($1, $2, $3, NOW() + interval '30 minutes', 0)
         ON CONFLICT (user_id) DO UPDATE
         SET code = EXCLUDED.code, token = EXCLUDED.token,
             expires_at = EXCLUDED.expires_at, attempts = 0`,
        [userId, code, token]
    );
}

async function finishConfirmation(result) {
    if (!result.rowCount) return null;
    await pool.query("DELETE FROM email_confirmations WHERE user_id = $1", [result.rows[0].id]);
    return result.rows[0];
}

const MAX_CONFIRM_ATTEMPTS = 5;

// Возвращает пользователя при верном коде, иначе null.
// Каждая проверка увеличивает счётчик попыток; после MAX_CONFIRM_ATTEMPTS код аннулируется,
// и нужно запросить новое письмо.

async function confirmByCode(email, code) {
    const attempt = await pool.query(
        `UPDATE email_confirmations c
         SET attempts = c.attempts + 1
         FROM users u
         WHERE u.id = c.user_id AND u.email = $1 AND c.expires_at > NOW()
         RETURNING c.user_id, c.code, c.attempts`,
        [email]
    );
    if (!attempt.rowCount) return null;
    const row = attempt.rows[0];
    if (row.attempts > MAX_CONFIRM_ATTEMPTS) {
        await pool.query("DELETE FROM email_confirmations WHERE user_id = $1", [row.user_id]);
        return null;
    }
    const given = Buffer.from(String(code));
    const expected = Buffer.from(row.code);
    if (given.length !== expected.length || !crypto.timingSafeEqual(given, expected)) return null;

    const result = await pool.query(
        `UPDATE users SET email_verified = TRUE
         WHERE id = $1
         RETURNING id, email, login, name`,
        [row.user_id]
    );
    return finishConfirmation(result);
}

async function findUnverifiedAccount(email) {
    const result = await pool.query(
        "SELECT id, email, name FROM users WHERE email = $1 AND email_verified = FALSE",
        [email]
    );
    return result.rows[0] || null;
}

async function confirmByToken(token) {
    const result = await pool.query(
        `UPDATE users u
         SET email_verified = TRUE
         FROM email_confirmations c
         WHERE u.id = c.user_id AND c.token = $1 AND c.expires_at > NOW()
         RETURNING u.id, u.email, u.login, u.name`,
        [token]
    );
    return finishConfirmation(result);
}

async function migratePlainPasswords() {
    const { rows } = await pool.query("SELECT id, password FROM users WHERE password IS NOT NULL");
    for (const row of rows) {
        if (!isHashed(row.password)) {
            await pool.query("UPDATE users SET password = $2 WHERE id = $1", [row.id, hashPassword(row.password)]);
        }
    }
}

async function cleanupSessions() {
    await pool.query("DELETE FROM sessions WHERE expires_at < NOW()");
}

async function createSession(sessionId, userId, ttlMs) {
    await pool.query(
        "INSERT INTO sessions (id, user_id, expires_at) VALUES ($1, $2, NOW() + make_interval(secs => $3))",
        [sessionId, userId, ttlMs / 1000]
    );
}

async function getSessionUser(sessionId) {
    if (!sessionId) return null;
    const result = await pool.query(
        `SELECT u.id, u.email, u.login, u.name
         FROM sessions s
         JOIN users u ON u.id = s.user_id
         WHERE s.id = $1 AND s.expires_at > NOW()`,
        [sessionId]
    );
    return result.rows[0] || null;
}

async function deleteSession(sessionId) {
    if (!sessionId) return;
    await pool.query("DELETE FROM sessions WHERE id = $1", [sessionId]);
}

module.exports = { createAccount, saveConfirmation, confirmByCode, findUnverifiedAccount, confirmByToken, findAccount, migratePlainPasswords, cleanupSessions, createSession, getSessionUser, deleteSession };

