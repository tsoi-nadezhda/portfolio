// Создание таблиц и тестовые данные.
const pool = require("./pool");
const config = require("../config");
const { hashPassword } = require("../password");
const { migratePlainPasswords, cleanupSessions } = require("./auth");

const ACCOUNT = {
    id: 31017,
    email: config.SEED_EMAIL,
    password: config.SEED_PASSWORD,
    login: "Nadya",
};

async function initSchema() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            sort_order INTEGER NOT NULL,
            name TEXT NOT NULL,
            status TEXT,
            email TEXT UNIQUE,
            password TEXT,
            login TEXT,
            unique_url_name TEXT,
            photo_small TEXT,
            photo_large TEXT
        );

        CREATE TABLE IF NOT EXISTS profiles (
            user_id INTEGER PRIMARY KEY REFERENCES users(id),
            about_me TEXT,
            looking_for_a_job BOOLEAN NOT NULL DEFAULT FALSE,
            looking_for_a_job_description TEXT,
            full_name TEXT NOT NULL,
            facebook TEXT,
            website TEXT,
            vk TEXT,
            twitter TEXT,
            instagram TEXT,
            youtube TEXT,
            github TEXT,
            main_link TEXT
        );

        CREATE TABLE IF NOT EXISTS follows (
            follower_id INTEGER NOT NULL REFERENCES users(id),
            followed_id INTEGER NOT NULL REFERENCES users(id),
            PRIMARY KEY (follower_id, followed_id)
        );

        CREATE TABLE IF NOT EXISTS sessions (
            id TEXT PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id)
        );

        CREATE TABLE IF NOT EXISTS app_meta (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS posts (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id),
            message TEXT NOT NULL,
            like_count INTEGER NOT NULL DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS post_likes (
            post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
            user_id INTEGER NOT NULL REFERENCES users(id),
            PRIMARY KEY (post_id, user_id)
        );

        CREATE TABLE IF NOT EXISTS messages (
            id SERIAL PRIMARY KEY,
            sender_id INTEGER NOT NULL REFERENCES users(id),
            receiver_id INTEGER NOT NULL REFERENCES users(id),
            body TEXT NOT NULL,
            viewed BOOLEAN NOT NULL DEFAULT FALSE
        );
    `);
    await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN NOT NULL DEFAULT TRUE");
    await pool.query(`
        CREATE TABLE IF NOT EXISTS email_confirmations (
            user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
            code TEXT NOT NULL,
            token TEXT NOT NULL UNIQUE,
            expires_at TIMESTAMPTZ NOT NULL
        );
    `);
    await pool.query("ALTER TABLE email_confirmations ADD COLUMN IF NOT EXISTS attempts INTEGER NOT NULL DEFAULT 0");
    await pool.query("ALTER TABLE messages ADD COLUMN IF NOT EXISTS viewed BOOLEAN NOT NULL DEFAULT FALSE");
    await pool.query(`
        CREATE TABLE IF NOT EXISTS album_tracks (
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            track_id TEXT NOT NULL,
            name TEXT NOT NULL,
            artist TEXT NOT NULL,
            album TEXT NOT NULL DEFAULT '',
            image TEXT NOT NULL DEFAULT '',
            audio TEXT NOT NULL,
            duration INTEGER NOT NULL DEFAULT 0,
            share_url TEXT NOT NULL DEFAULT '',
            saved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            PRIMARY KEY (user_id, track_id)
        );
    `);
    await pool.query("ALTER TABLE sessions ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ");
    await pool.query(
        "UPDATE sessions SET expires_at = NOW() + make_interval(hours => $1) WHERE expires_at IS NULL",
        [config.SESSION_TTL_HOURS]
    );
    await migratePlainPasswords();
    await cleanupSessions();

    const count = await pool.query("SELECT COUNT(*)::int AS count FROM users");
    if (count.rows[0].count > 0) {
        await fillEmptyProfileFields();
        await seedRelationsOnce();
        await seedPostsOnce();
        await seedMessagesOnce();
        return;
    }

    const firstNames = ["Nadya", "Ivan", "Olga", "Petr", "Anna", "Sergey", "Maria", "Alex", "Elena", "Dmitry", "Kate", "Oleg"];
    const lastNames = ["Ivanova", "Petrov", "Sokolova", "Orlov", "Smirnova", "Volkov", "Kuznetsova", "Morozov", "Popova", "Lebedev"];
    const statuses = ["Learning React", "Looking for a job", "At home", "Hello there", "Coding", "Hello"];
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        for (let i = 0; i < 60; i++) {
            const id = i === 0 ? ACCOUNT.id : i;
            const name = i === 0 ? "Nadya Ivanova" : `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`;
            const status = i === 0 ? "Hello, I'm Nadya" : statuses[i % statuses.length];
            await client.query(
                `INSERT INTO users (id, sort_order, name, status, email, password, login)
                 VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [
                    id,
                    i,
                    name,
                    status,
                    i === 0 ? ACCOUNT.email : null,
                    i === 0 ? hashPassword(ACCOUNT.password) : null,
                    i === 0 ? ACCOUNT.login : null,
                ]
            );
            const slug = name.toLowerCase().replace(/\s+/g, "");
            await client.query(
                `INSERT INTO profiles (
                    user_id, about_me, looking_for_a_job, looking_for_a_job_description, full_name,
                    facebook, website, vk, twitter, instagram, youtube, github, main_link
                 ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
                [
                    id,
                    i === 0 ? "Frontend student" : `About ${name}`,
                    i % 3 === 0,
                    i % 3 === 0 ? "Open to frontend roles" : `Working on my own projects`,
                    name,
                    `facebook.com/${slug}`,
                    `${slug}.example.com`,
                    `vk.com/${slug}`,
                    `twitter.com/${slug}`,
                    `@${slug}`,
                    `youtube.com/${slug}`,
                    `github.com/${slug}`,
                    `${slug}.example.com`,
                ]
            );
        }
        for (const followedId of [2, 5, 8]) {
            await client.query(
                "INSERT INTO follows (follower_id, followed_id) VALUES ($1, $2)",
                [ACCOUNT.id, followedId]
            );
        }
        for (const followerId of [2, 5, 9]) {
            await client.query(
                "INSERT INTO follows (follower_id, followed_id) VALUES ($1, $2)",
                [followerId, ACCOUNT.id]
            );
        }
        await client.query(
            "INSERT INTO app_meta (key, value) VALUES ('relations_seeded', '1')"
        );
        await client.query("COMMIT");
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
    await seedPostsOnce();
    await seedMessagesOnce();
}

async function fillEmptyProfileFields() {
    const { rows } = await pool.query(`
        SELECT u.id, u.name, u.status
        FROM users u
        JOIN profiles p ON p.user_id = u.id
        WHERE u.id <> $1
          AND (
            p.about_me IS NULL OR p.looking_for_a_job_description IS NULL
            OR p.facebook IS NULL OR p.website IS NULL OR p.vk IS NULL
            OR p.twitter IS NULL OR p.instagram IS NULL OR p.youtube IS NULL
            OR p.github IS NULL OR p.main_link IS NULL OR u.status IS NULL
          )
    `, [ACCOUNT.id]);
    for (const row of rows) {
        const slug = row.name.toLowerCase().replace(/\s+/g, "");
        await pool.query(
            `UPDATE profiles SET
                about_me = COALESCE(about_me, $2),
                looking_for_a_job_description = COALESCE(looking_for_a_job_description, $3),
                facebook = COALESCE(facebook, $4),
                website = COALESCE(website, $5),
                vk = COALESCE(vk, $6),
                twitter = COALESCE(twitter, $7),
                instagram = COALESCE(instagram, $8),
                youtube = COALESCE(youtube, $9),
                github = COALESCE(github, $10),
                main_link = COALESCE(main_link, $11)
             WHERE user_id = $1`,
            [
                row.id,
                `About ${row.name}`,
                "Open to new projects",
                `facebook.com/${slug}`,
                `${slug}.example.com`,
                `vk.com/${slug}`,
                `twitter.com/${slug}`,
                `@${slug}`,
                `youtube.com/${slug}`,
                `github.com/${slug}`,
                `${slug}.example.com`,
            ]
        );
        if (!row.status) {
            await pool.query("UPDATE users SET status = $2 WHERE id = $1", [row.id, "Hello"]);
        }
    }
}

async function seedRelationsOnce() {
    const seeded = await pool.query("SELECT 1 FROM app_meta WHERE key = 'relations_seeded'");
    if (seeded.rowCount > 0) return;
    for (const followerId of [2, 5, 9]) {
        await pool.query(
            `INSERT INTO follows (follower_id, followed_id) VALUES ($1, $2)
             ON CONFLICT DO NOTHING`,
            [followerId, ACCOUNT.id]
        );
    }
    await pool.query("INSERT INTO app_meta (key, value) VALUES ('relations_seeded', '1')");
}

async function seedMessagesOnce() {
    const seeded = await pool.query("SELECT 1 FROM app_meta WHERE key = 'messages_seeded'");
    if (seeded.rowCount > 0) return;
    const people = await pool.query("SELECT id FROM users WHERE id = ANY($1::int[])", [[2, 5]]);
    const ids = new Set(people.rows.map((row) => row.id));
    if (ids.has(2)) {
        await pool.query(
            `INSERT INTO messages (sender_id, receiver_id, body) VALUES
             ($1, 2, 'Hi Olga!'),
             (2, $1, 'Hi! How are you?')`,
            [ACCOUNT.id]
        );
    }
    if (ids.has(5)) {
        await pool.query(
            "INSERT INTO messages (sender_id, receiver_id, body) VALUES ($1, 5, 'Hello Sergey')",
            [ACCOUNT.id]
        );
    }
    await pool.query("INSERT INTO app_meta (key, value) VALUES ('messages_seeded', '1')");
}

async function seedPostsOnce() {
    const seeded = await pool.query("SELECT 1 FROM app_meta WHERE key = 'posts_seeded'");
    if (seeded.rowCount > 0) return;
    await pool.query(
        `INSERT INTO posts (user_id, message, like_count) VALUES ($1, $2, $3), ($1, $4, $5)`,
        [ACCOUNT.id, "Hi! How are you?", 15, "It's my first post", 20]
    );
    await pool.query("INSERT INTO app_meta (key, value) VALUES ('posts_seeded', '1')");
}

module.exports = { initSchema };
