const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const config = require("./config");
const { uploadsDir } = require("./upload");
const { fail } = require("./http");

const app = express();

app.use(cors({ origin: config.ALLOWED_ORIGINS, credentials: true }));

// Защита от CSRF: запросы с изменением данных принимаются только с разрешённых источников.
app.use((req, res, next) => {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return next();
  const origin = req.get("origin");
  if (origin && !config.ALLOWED_ORIGINS.includes(origin)) {
    return res.status(403).json(fail("Forbidden origin"));
  }
  next();
});

app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());
app.use(
  "/uploads",
  express.static(uploadsDir, {
    setHeaders: (res) => res.set("X-Content-Type-Options", "nosniff"),
  }),
);

const API = "/api/1.0";
app.use(`${API}/auth`, require("./routes/auth"));
app.use(`${API}/dialogs`, require("./routes/dialogs"));
app.use(`${API}/music`, require("./routes/music"));
app.use(`${API}/profile`, require("./routes/posts"));
app.use(`${API}/profile`, require("./routes/profile"));
app.use(API, require("./routes/users"));

module.exports = app;
