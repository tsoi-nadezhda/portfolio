const db = require("../db");
const { fail, wrap } = require("../http");

// Определяет текущего пользователя по cookie и кладёт его в req.user (или null).
const loadUser = wrap(async (req, res, next) => {
  if (req.user !== undefined) return next();
  req.user = await db.getSessionUser(req.cookies.sessionId);
  next();
});

// Пропускает дальше только авторизованных пользователей.
function requireAuth(req, res, next) {
  if (!req.user) return res.json(fail("You are not authorized"));
  next();
}

module.exports = { loadUser, requireAuth };
