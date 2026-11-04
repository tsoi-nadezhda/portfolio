const crypto = require("crypto");

const PREFIX = "scrypt$";

function hashPassword(password) {
    const salt = crypto.randomBytes(16);
    const hash = crypto.scryptSync(password, salt, 64);
    return `${PREFIX}${salt.toString("hex")}$${hash.toString("hex")}`;
}

function isHashed(value) {
    return typeof value === "string" && value.startsWith(PREFIX);
}

function verifyPassword(password, stored) {
    if (!isHashed(stored)) return false;
    const [, saltHex, hashHex] = stored.split("$");
    const expected = Buffer.from(hashHex, "hex");
    const actual = crypto.scryptSync(password, Buffer.from(saltHex, "hex"), expected.length);
    return crypto.timingSafeEqual(actual, expected);
}

module.exports = { hashPassword, verifyPassword, isHashed };
