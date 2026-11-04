// Общие помощники HTTP-слоя: формат ответов, обработка ошибок, валидация.
const express = require("express");

const MAX_TEXT = 5000;
const MAX_STATUS = 300;
const MAX_FIELD = 500;

const ok = (data = {}) => ({ resultCode: 0, messages: [], data });
const fail = (message) => ({ resultCode: 1, messages: [message], data: {} });

// Оборачивает async-обработчик: любая ошибка превращается в ответ 500.
const wrap = (handler) => (req, res, next) => {
  Promise.resolve(handler(req, res, next)).catch((error) => {
    console.error(error);
    res.status(500).json(fail("Server error"));
  });
};

const text = (value, max) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";
const tooLong = (value, max) =>
  typeof value === "string" && value.trim().length > max;

// Router с проверкой идентификаторов в путях (param-обработчики не наследуются от app,
// поэтому их нужно регистрировать на каждом router).
function createRouter() {
  const router = express.Router();
  for (const name of ["userId", "postId", "messageId"]) {
    router.param(name, (req, res, next, value) => {
      if (!/^\d{1,9}$/.test(value) || Number(value) < 1)
        return res.status(400).json(fail(`Invalid ${name}`));
      next();
    });
  }
  return router;
}

module.exports = {
  MAX_TEXT,
  MAX_STATUS,
  MAX_FIELD,
  ok,
  fail,
  wrap,
  text,
  tooLong,
  createRouter,
};
