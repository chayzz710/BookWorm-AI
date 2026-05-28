//authController.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const SECRET = process.env.JWT_SECRET

const signToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email },
        SECRET,
        { expiresIn: "7d" }
    );
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user)
            return res.status(401)
                .json("No record existing");

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch)
            return res.status(401)
                .json("Incorrect password");

        const token = signToken(user);
        res.json({ token, userId: user._id, name: user.name });

    } catch (err) {
        res.status(500).json({ error: "Login failed", details: err.message });
    }
};

const signUp = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const newUser = await User.create({ ...req.body, password: hashedPassword });

        const token = signToken(newUser);

        res.json({ token, userId: newUser._id, name: newUser.name });
    } catch (err) {
        res.status(500).json({ error: "Registration failed", details: err.message });
    }
};

module.exports = { login, signUp };
