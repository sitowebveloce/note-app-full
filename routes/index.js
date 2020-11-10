// Require 
const express = require('express');
const router = express.Router();
// Is authorized 
const { authenticateToken } = require('../middlewares/isAuthorized');

// GET HOME PAGE
router.get('/', authenticateToken, (req, res) => {
    res.render('index.ejs', {
        user: req.user,
        msg: `Wellcome ${req.user}`
    });
});


// Export router
module.exports = router;