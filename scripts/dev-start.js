const { applyApiMode } = require("./api-mode");

applyApiMode(process.argv[2]);
process.env.HOST = process.env.HOST || "127.0.0.1";
process.env.WATCHPACK_POLLING = "true";
process.env.CHOKIDAR_USEPOLLING = "true";

require("react-scripts/scripts/start");
