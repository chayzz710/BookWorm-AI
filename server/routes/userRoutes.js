const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/auth");
const User = require("../models/User");

router.put("/update-profile", authenticate, async (req, res) => {
    const { name, email, userImg } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        { name, email, userImg },
        { new: true }
    );

    res.json(updatedUser);
});

module.exports = router;