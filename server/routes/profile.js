const fs = require("fs");
const db = require("../db");
const { upload, hasImageSignature } = require("../upload");
const { loadUser, requireAuth } = require("../middleware/auth");
const {
  MAX_STATUS,
  MAX_FIELD,
  ok,
  fail,
  wrap,
  tooLong,
  createRouter,
} = require("../http");

const router = createRouter();
router.use(loadUser);

const CONTACT_KEYS = [
  "facebook",
  "website",
  "vk",
  "twitter",
  "instagram",
  "youtube",
  "github",
  "mainLink",
];

// Собирает из тела запроса только известные поля нужного типа и длины.
// Возвращает { data } или { error }.
function parseProfileBody(rawBody) {
  const body = rawBody && typeof rawBody === "object" ? rawBody : {};
  const contactsIn =
    body.contacts && typeof body.contacts === "object" ? body.contacts : {};
  const data = { contacts: {} };

  for (const key of ["fullName", "aboutMe", "lookingForAJobDescription"]) {
    if (body[key] == null) continue;
    if (typeof body[key] !== "string" || tooLong(body[key], MAX_FIELD))
      return { error: `Invalid ${key}` };
    data[key] = body[key];
  }
  if (data.fullName !== undefined && !data.fullName.trim())
    return { error: "Full name is required" };
  if (body.lookingForAJob != null)
    data.lookingForAJob = Boolean(body.lookingForAJob);

  for (const key of CONTACT_KEYS) {
    if (contactsIn[key] == null) continue;
    if (typeof contactsIn[key] !== "string" || tooLong(contactsIn[key], MAX_FIELD))
      return { error: `Invalid contact ${key}` };
    data.contacts[key] = contactsIn[key];
  }
  return { data };
}

router.get(
  "/status/:userId",
  wrap(async (req, res) => {
    const status = await db.getStatus(Number(req.params.userId));
    if (status === undefined)
      return res.status(404).json(fail("User not found"));
    res.json(status);
  }),
);

router.put(
  "/status",
  requireAuth,
  wrap(async (req, res) => {
    const status =
      req.body && typeof req.body.status === "string" ? req.body.status : "";
    if (status.length > MAX_STATUS)
      return res.json(fail(`Status must be at most ${MAX_STATUS} characters`));
    await db.setStatus(req.user.id, status);
    res.json({ ...ok(), status });
  }),
);

router.get(
  "/:userId",
  wrap(async (req, res) => {
    const profile = await db.getProfile(
      Number(req.params.userId),
      req.user ? req.user.id : null,
    );
    if (!profile) return res.status(404).json(fail("User not found"));
    res.json(profile);
  }),
);

router.delete(
  "/photo",
  requireAuth,
  wrap(async (req, res) => {
    await db.savePhoto(req.user.id, null);
    res.json(ok({ photos: { small: null, large: null } }));
  }),
);

router.put("/photo", requireAuth, (req, res) => {
  upload.single("image")(req, res, (error) => {
    if (error) return res.json(fail(error.message));
    wrap(async (request, response) => {
      if (!request.file) return response.json(fail("Photo is required"));
      if (!hasImageSignature(request.file.path, request.file.mimetype)) {
        fs.rmSync(request.file.path, { force: true });
        return response.json(fail("File is not a valid jpg or png image"));
      }
      const photoUrl = `${request.protocol}://${request.get("host")}/uploads/${request.file.filename}`;
      await db.savePhoto(request.user.id, photoUrl);
      response.json(ok({ photos: { small: photoUrl, large: photoUrl } }));
    })(req, res);
  });
});

router.put(
  "/",
  requireAuth,
  wrap(async (req, res) => {
    const { data, error } = parseProfileBody(req.body);
    if (error) return res.json(fail(error));
    const saved = await db.saveProfile(req.user.id, data);
    if (!saved) return res.json(fail("User not found"));
    res.json(ok());
  }),
);

module.exports = router;
