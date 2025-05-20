// middleware/auth.js
const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET

const authenticate = (req, res, next) => {
    //reads the authorisation header from incoming request
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json("Token missing");

    //extracts the token from the header
    const token = authHeader.split(" ")[1];
    try {
        //verifies the token with the secret key
        const decoded = jwt.verify(token, SECRET);
        req.user = decoded; // contains id, email
        next();
    } catch (err) {
        res.status(401).json("Invalid token");
    }
};

module.exports = authenticate;
