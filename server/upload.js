// Загрузка фотографий профиля.
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const uploadsDir = path.join(__dirname, "uploads");
fs.mkdirSync(uploadsDir, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
      const ext = file.mimetype === "image/png" ? ".png" : ".jpg";
      cb(null, `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png")
      cb(null, true);
    else cb(new Error("Only jpg and png photos are allowed"));
  },
});

// Проверка первых байт файла: PNG или JPEG.
function hasImageSignature(file, mimetype) {
  const buffer = Buffer.alloc(8);
  const fd = fs.openSync(file, "r");
  try {
    fs.readSync(fd, buffer, 0, 8, 0);
  } finally {
    fs.closeSync(fd);
  }
  if (mimetype === "image/png")
    return buffer.equals(
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    );
  return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
}

module.exports = { uploadsDir, upload, hasImageSignature };
