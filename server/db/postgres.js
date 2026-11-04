// Запуск локального PostgreSQL и создание базы данных.
const { spawnSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");
const config = require("../config");

const PG_BIN = config.PG_BIN;
const DATA_DIR = path.join(__dirname, "..", "pgdata");
const DB_HOST = config.DB_HOST;
const DB_PORT = config.DB_PORT;
const DB_USER = config.DB_USER;
const DB_PASSWORD = config.DB_PASSWORD;
const DB_NAME = config.DB_NAME;

function runPg(exe, args, stdio = "pipe") {
    const result = spawnSync(path.join(PG_BIN, exe), args, {
        encoding: "utf8",
        stdio,
        windowsHide: true,
    });
    if (result.error) throw result.error;
    if (result.status !== 0) {
        throw new Error((result.stderr || result.stdout || `${exe} failed`).toString().trim());
    }
}

async function canConnect() {
    const { Client } = require("pg");
    const client = new Client({
        host: DB_HOST,
        port: DB_PORT,
        user: DB_USER,
        password: DB_PASSWORD,
        database: "postgres",
        connectionTimeoutMillis: 1500,
    });
    try {
        await client.connect();
        await client.end();
        return true;
    } catch (error) {
        return false;
    }
}

async function ensurePostgres() {
    if (!fs.existsSync(path.join(DATA_DIR, "PG_VERSION"))) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
        const passwordFile = path.join(os.tmpdir(), "social-network-pg.pw");
        fs.writeFileSync(passwordFile, DB_PASSWORD);
        try {
            runPg("initdb.exe", [
                "-D", DATA_DIR,
                "-U", DB_USER,
                "-E", "UTF8",
                "--locale=C",
                "--auth=scram-sha-256",
                `--pwfile=${passwordFile}`,
            ]);
        } finally {
            fs.rmSync(passwordFile, { force: true });
        }
    }
    if (await canConnect()) return;
    try {
        runPg("pg_ctl.exe", [
            "-D", DATA_DIR,
            "-l", path.join(DATA_DIR, "server.log"),
            "-w",
            "start",
            "-o", `-p ${DB_PORT}`,
        ], "ignore");
    } catch (error) {
        if (await canConnect()) return;
        throw error;
    }
}

async function ensureDatabase() {
    const { Client } = require("pg");
    const client = new Client({
        host: DB_HOST,
        port: DB_PORT,
        user: DB_USER,
        password: DB_PASSWORD,
        database: "postgres",
    });
    await client.connect();
    const existing = await client.query("SELECT 1 FROM pg_database WHERE datname = $1", [DB_NAME]);
    if (existing.rowCount === 0) {
        await client.query(`CREATE DATABASE ${DB_NAME}`);
    }
    await client.end();
}

module.exports = { ensurePostgres, ensureDatabase };
