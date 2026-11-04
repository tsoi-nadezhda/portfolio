const db = require("../db");
const { loadUser, requireAuth } = require("../middleware/auth");
const { MAX_TEXT, ok, fail, wrap, text, createRouter } = require("../http");

const router = createRouter();
router.use(loadUser, requireAuth);

router.get(
  "/",
  wrap(async (req, res) => {
    res.json(ok({ dialogs: await db.getDialogs(req.user.id) }));
  }),
);

router.get(
  "/:userId/messages",
  wrap(async (req, res) => {
    const data = await db.getMessages(req.user.id, Number(req.params.userId));
    if (!data) return res.json(fail("User not found"));
    res.json(ok(data));
  }),
);

router.delete(
  "/messages/:messageId",
  wrap(async (req, res) => {
    const deleted = await db.deleteMessage(
      req.user.id,
      Number(req.params.messageId),
    );
    if (!deleted) return res.json(fail("Message not found"));
    res.json(ok(deleted));
  }),
);

router.post(
  "/:userId/messages",
  wrap(async (req, res) => {
    const message = text(req.body && req.body.message, MAX_TEXT + 1);
    if (!message) return res.json(fail("Message is empty"));
    if (message.length > MAX_TEXT) return res.json(fail("Message is too long"));
    const saved = await db.addMessage(
      req.user.id,
      Number(req.params.userId),
      message,
    );
    if (!saved) return res.json(fail("User not found"));
    res.json(ok({ message: saved }));
  }),
);

module.exports = router;
