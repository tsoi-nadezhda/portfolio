const crypto = require("crypto");
const config = require("../config");
const db = require("../db");
const { sendConfirmation } = require("../mail");
const rateLimit = require("../rateLimit");
const { loadUser, requireAuth } = require("../middleware/auth");
const { ok, fail, wrap, text, createRouter } = require("../http");

const router = createRouter();

// Ограничения частоты для эндпоинтов авторизации.
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 30 });
const emailKey = (req) => text(req.body && req.body.email, 255).toLowerCase();
const confirmEmailLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  key: emailKey,
});
const resendIpLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 });
const resendEmailLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 1,
  key: emailKey,
  message: "Wait a minute before requesting another email",
});

// Создаёт код и токен подтверждения и отправляет письмо.
// Если письмо не ушло, аккаунт и код остаются, письмо можно запросить повторно через /auth/resend.
async function issueConfirmation(account) {
  const code = String(crypto.randomInt(100000, 1000000));
  const token = crypto.randomBytes(32).toString("hex");
  await db.saveConfirmation(account.id, code, token);
  return sendConfirmation({
    to: account.email,
    name: account.name,
    code,
    link: new URL(`/confirm/${token}`, config.FRONTEND_URL).href,
  });
}

// Создаёт сессию в БД и выставляет cookie с тем же сроком жизни.
async function beginSession(res, userId, rememberMe) {
  const sessionId = crypto.randomUUID();
  const ttlMs = rememberMe
    ? config.SESSION_REMEMBER_DAYS * 24 * 60 * 60 * 1000
    : config.SESSION_TTL_HOURS * 60 * 60 * 1000;
  await db.createSession(sessionId, userId, ttlMs);
  res.cookie("sessionId", sessionId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: ttlMs,
  });
}

router.get(
  "/me",
  loadUser,
  requireAuth,
  wrap(async (req, res) => {
    const me = req.user;
    res.json(
      ok({ id: me.id, email: me.email, login: me.login, name: me.name }),
    );
  }),
);

router.post(
  "/register",
  authLimiter,
  wrap(async (req, res) => {
    const name = text(req.body && req.body.name, 101);
    const email = emailKey(req);
    const password =
      req.body && typeof req.body.password === "string"
        ? req.body.password
        : "";
    if (!name) return res.json(fail("Name is required"));
    if (name.length > 100) return res.json(fail("Name is too long"));
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return res.json(fail("Email is required"));
    if (password.length > 200) return res.json(fail("Password is too long"));
    if (password.length < 4)
      return res.json(fail("Password must be at least 4 characters"));
    const account = await db.createAccount(name, email, password);
    if (account.error) return res.json(fail(account.error));
    const sent = await issueConfirmation(account);
    res.json(ok({ pending: true, email: account.email, mailed: sent.sent }));
  }),
);

// Повторная отправка письма. Ответ всегда одинаковый, чтобы не раскрывать, зарегистрирован ли email.
router.post(
  "/resend",
  resendIpLimiter,
  resendEmailLimiter,
  wrap(async (req, res) => {
    const account = await db.findUnverifiedAccount(emailKey(req));
    if (account) await issueConfirmation(account);
    res.json(ok({ pending: true }));
  }),
);

router.post(
  "/confirm",
  authLimiter,
  confirmEmailLimiter,
  wrap(async (req, res) => {
    const code = text(req.body && req.body.code, 12);
    const account = await db.confirmByCode(emailKey(req), code);
    if (!account) return res.json(fail("The code is wrong or expired"));
    await beginSession(res, account.id, true);
    res.json(ok({ userId: account.id }));
  }),
);

router.post(
  "/confirm/:token",
  authLimiter,
  wrap(async (req, res) => {
    const account = await db.confirmByToken(req.params.token);
    if (!account)
      return res.json(fail("This confirmation link is invalid or expired"));
    await beginSession(res, account.id, true);
    res.json(ok({ userId: account.id }));
  }),
);

router.post(
  "/login",
  authLimiter,
  wrap(async (req, res) => {
    const email = emailKey(req);
    const password =
      req.body && typeof req.body.password === "string"
        ? req.body.password
        : "";
    const rememberMe = Boolean(req.body && req.body.rememberMe);
    const account = await db.findAccount(email, password);
    if (!account) return res.json(fail("Incorrect email or password"));
    if (!account.emailVerified)
      return res.json(fail("Confirm your email before signing in"));
    await beginSession(res, account.id, rememberMe);
    res.json(ok({ userId: account.id }));
  }),
);

router.delete(
  "/login",
  wrap(async (req, res) => {
    await db.deleteSession(req.cookies.sessionId);
    res.clearCookie("sessionId", { path: "/" });
    res.json(ok());
  }),
);

module.exports = router;
