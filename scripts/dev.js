// Запускает API и фронтенд одной командой: npm run dev
const { spawn } = require("child_process");
const path = require("path");

const root = path.join(__dirname, "..");
const children = [];
let stopping = false;

function run(name, script) {
    const child = spawn(process.execPath, [path.join(root, script)], {
        cwd: root,
        stdio: ["ignore", "pipe", "pipe"],
        env: process.env,
    });
    const pipe = (stream, out) => {
        let buffer = "";
        stream.on("data", (chunk) => {
            buffer += chunk;
            const lines = buffer.split(/\r?\n/);
            buffer = lines.pop();
            for (const line of lines) out.write(`[${name}] ${line}\n`);
        });
    };
    pipe(child.stdout, process.stdout);
    pipe(child.stderr, process.stderr);
    child.on("exit", (code) => {
        if (!stopping) {
            console.error(`[${name}] завершился с кодом ${code}, останавливаю остальные процессы`);
            stop(code || 1);
        }
    });
    children.push(child);
}

function stop(code = 0) {
    stopping = true;
    for (const child of children) child.kill();
    process.exit(code);
}

process.on("SIGINT", () => stop(0));
process.on("SIGTERM", () => stop(0));

run("api", "server/index.js");
run("web", "scripts/dev-start.js");
