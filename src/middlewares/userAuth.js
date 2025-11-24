const User = require("../models/user");
const jwt = require('jsonwebtoken');

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).json({ message: "Token not found" });
        }

        const decoded = jwt.verify(token, "DivTinder@123");
        const user = await User.findById(decoded._id);

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = user;
        next();

    } catch (err) {
        return res.status(401).json({
            success: false,
            message: "Auth Error: " + err.message
        });
    }
};

module.exports = userAuth;
