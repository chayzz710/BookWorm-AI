//this sets up a modular route.
const express = require("express");
const router = express.Router();
const { handleRecommendation } = require("../controllers/chatbotController");

router.post("/", handleRecommendation);

module.exports = router;
