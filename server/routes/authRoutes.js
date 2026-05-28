//authRoutes.js
const express = require("express");
const router = express.Router();
const { login, signUp } = require("../controllers/authController");

router.post("/", login);
router.post("/signup", signUp);

module.exports = router;
