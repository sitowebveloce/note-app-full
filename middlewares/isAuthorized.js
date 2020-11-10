// Require json web token
const jwt = require('jsonwebtoken');

// AUTHENTICATE TOKEN FUNCTION
exports.authenticateToken = async(req, res, next) => {
    // console.log(`headers: ${req.headers}`)
    const authHeader = req.headers.cookie;
    const token = authHeader && authHeader.split("=")[1];
    // console.log(`token: ${token}`)
    if (token == null) {
        return res.redirect('/users/login')
    }
    // JWT VERIFY
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        // POPULATE REQ.USER
        // console.log(user, user.email)
        req.user = user.email;
        // console.log(req.user)
        next();
    });
};