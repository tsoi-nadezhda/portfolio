const fs = require("fs");
const path = require("path");

// Минимальная загрузка .env (переменные окружения имеют приоритет над файлом).
function loadEnvFile(file) {
    if (!fs.existsSync(file)) return;
    for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
        const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
        if (!match || line.trim().startsWith("#")) continue;
        const value = match[2].replace(/^(['"])(.*)\1$/, "$2");
        if (process.env[match[1]] === undefined) process.env[match[1]] = value;
    }
}

const envPath = path.join(__dirname, "..", ".env");

loadEnvFile(envPath);

const env = process.env;

module.exports = {
    PORT: Number(env.API_PORT) || 3001,
    FRONTEND_URL: env.FRONTEND_URL || "http://localhost:3000",
    // Разрешённые источники запросов (через запятую).
    ALLOWED_ORIGINS: (env.ALLOWED_ORIGINS || "http://127.0.0.1:3000,http://localhost:3000")
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean),
    SESSION_TTL_HOURS: Number(env.SESSION_TTL_HOURS) || 24,
    SESSION_REMEMBER_DAYS: Number(env.SESSION_REMEMBER_DAYS) || 7,
    PG_BIN: env.PG_BIN || "C:\\Program Files\\PostgreSQL\\18\\bin",
    DB_HOST: env.DB_HOST || "127.0.0.1",
    DB_PORT: Number(env.DB_PORT) || 5433,
    DB_USER: env.DB_USER || "social",
    DB_PASSWORD: env.DB_PASSWORD || "social",
    DB_NAME: env.DB_NAME || "social",
    // Тестовый аккаунт, создаётся только при пустой базе.
    SEED_EMAIL: env.SEED_EMAIL || "nadya@mail.com",
    SEED_PASSWORD: env.SEED_PASSWORD || "12345",
    SMTP_HOST: env.SMTP_HOST || "",
    SMTP_PORT: Number(env.SMTP_PORT) || 587,
    SMTP_USER: env.SMTP_USER || "",
    SMTP_PASS: env.SMTP_PASS || "",
    MAIL_FROM: env.MAIL_FROM || env.SMTP_USER || "Social <noreply@localhost>",
    JAMENDO_CLIENT_ID: env.JAMENDO_CLIENT_ID || "",
};
