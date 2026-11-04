const db = require("../db");
const { loadUser, requireAuth } = require("../middleware/auth");
const { ok, fail, wrap, createRouter } = require("../http");

const router = createRouter();
// Router подключается в корень API, поэтому текущий пользователь определяется только для своих путей.
router.use(["/users", "/follow"], loadUser);

// Для неавторизованных пользователей связи просто пустые.
router.get(
  "/users/relations",
  wrap(async (req, res) => {
    if (!req.user)
      return res.json(ok({ friends: [], following: [], followers: [] }));
    res.json(ok(await db.getRelations(req.user.id)));
  }),
);

router.get(
  "/users",
  wrap(async (req, res) => {
    const count = Math.min(Math.max(Number(req.query.count) || 10, 1), 100);
    const page = Math.max(Number(req.query.page) || 1, 1);
    res.json(
      await db.getUsers(count, page, req.user ? req.user.id : null),
    );
  }),
);

router.post(
  "/follow/:userId",
  requireAuth,
  wrap(async (req, res) => {
    const userId = Number(req.params.userId);
    if (!(await db.findUser(userId))) return res.json(fail("User not found"));
    if (userId === req.user.id)
      return res.json(fail("You can't follow yourself"));
    await db.followUser(req.user.id, userId);
    res.json(ok());
  }),
);

router.delete(
  "/follow/:userId",
  requireAuth,
  wrap(async (req, res) => {
    const userId = Number(req.params.userId);
    if (!(await db.findUser(userId))) return res.json(fail("User not found"));
    await db.unfollowUser(req.user.id, userId);
    res.json(ok());
  }),
);

module.exports = router;
