const db = require("../db");
const { fail, wrap } = require("../http");

const SESSION_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Cookie с API (другой сайт) телефонные браузеры не сохраняют, поэтому сессия
// также принимается заголовком Authorization: Bearer.
function readSessionId(req) {
  const header = req.get("authorization") || "";
  const bearer = /^Bearer\s+([0-9a-f-]{36})$/i.exec(header);
  if (bearer && SESSION_ID.test(bearer[1])) return bearer[1];
  const cookie = req.cookies && req.cookies.sessionId;
  if (typeof cookie === "string" && SESSION_ID.test(cookie)) return cookie;
  return null;
}

// Определяет текущего пользователя по сессии и кладёт его в req.user (или null).
const loadUser = wrap(async (req, res, next) => {
  if (req.user !== undefined) return next();
  req.user = await db.getSessionUser(readSessionId(req));
  next();
});

// Пропускает дальше только авторизованных пользователей.
function requireAuth(req, res, next) {
  if (!req.user) return res.json(fail("You are not authorized"));
  next();
}

module.exports = { loadUser, requireAuth, readSessionId };
