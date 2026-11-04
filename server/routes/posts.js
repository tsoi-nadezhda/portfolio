// Посты профиля. Подключается по префиксу /profile.
const db = require("../db");
const { loadUser, requireAuth } = require("../middleware/auth");
const { MAX_TEXT, ok, fail, wrap, text, createRouter } = require("../http");

const router = createRouter();
router.use(loadUser);

router.get(
  "/:userId/posts",
  wrap(async (req, res) => {
    const posts = await db.getPosts(
      Number(req.params.userId),
      req.user ? req.user.id : null,
    );
    res.json(posts);
  }),
);

router.post(
  "/:userId/posts",
  requireAuth,
  wrap(async (req, res) => {
    const userId = Number(req.params.userId);
    if (req.user.id !== userId)
      return res.json(fail("You can only add posts on your profile"));
    const message = text(req.body && req.body.message, MAX_TEXT + 1);
    if (!message) return res.json(fail("Post is empty"));
    if (message.length > MAX_TEXT) return res.json(fail("Post is too long"));
    const post = await db.addPost(userId, message);
    res.json(ok({ post }));
  }),
);

router.put(
  "/:userId/posts/:postId/like",
  requireAuth,
  wrap(async (req, res) => {
    const post = await db.toggleLike(
      Number(req.params.userId),
      Number(req.params.postId),
      req.user.id,
    );
    if (!post) return res.json(fail("Post not found"));
    res.json(ok({ post }));
  }),
);

router.delete(
  "/:userId/posts/:postId",
  requireAuth,
  wrap(async (req, res) => {
    const userId = Number(req.params.userId);
    if (req.user.id !== userId)
      return res.json(fail("You can only delete your posts"));
    const deleted = await db.deletePost(userId, Number(req.params.postId));
    if (!deleted) return res.json(fail("Post not found"));
    res.json(ok());
  }),
);

module.exports = router;
