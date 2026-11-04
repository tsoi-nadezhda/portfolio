const config = require("./config");
const db = require("./db");
const app = require("./app");

async function main() {
  await db.ensurePostgres();
  await db.ensureDatabase();
  await db.initSchema();
  app.listen(config.PORT, () => {
    console.log(`Local API http://localhost:${config.PORT}/api/1.0/`);
    console.log(
      `Database: PostgreSQL ${config.DB_HOST}:${config.DB_PORT} / ${config.DB_NAME}`,
    );
    console.log(`Login: ${config.SEED_EMAIL} / ${config.SEED_PASSWORD}`);
  });
  setInterval(
    () => db.cleanupSessions().catch(console.error),
    60 * 60 * 1000,
  ).unref();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
