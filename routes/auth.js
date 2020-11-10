// Router
const express = require('express');
const bcrypt = require('bcrypt');
const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');
// Import is authorized middleware
const { authenticateToken } = require('../middlewares/isAuthorized');
// Define router
const router = express.Router();

// GET SIGN UP
router.get('/signup', (req, res) => {
    res
        .status(200)
        .render('signup.ejs', {
            user: req.user
        });
});


// POST NEW USER SIGN UP
router.post('/signup', async(req, res) => {
    try {
        // console.log(req.body);
        // Define values
        let displayName = req.body.displayName;
        let email = req.body.email.toLowerCase().trim();
        let password = req.body.password;
        let confirm = req.body.confirm;
        // STRONG PASSWORD REGEX
        let strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
        let isStrong = (strongRegex).test(password);
        // Check password match
        if (password !== confirm) {
            return res.status(201)
                .render('signup', {
                    msg: 'Password must match.'
                });
        };
        // Check password strong
        if (isStrong === false) {
            return res.status(201)
                .render('signup', {
                    msg: 'Password must be strong.'
                });
        };

        // URL TO FETCH
        let url = `http://localhost:3000/users`;
        // Check if user is already present
        let filterUrl = url + `?email=${email}`;
        let userFilter = await fetch(filterUrl);
        let filterRes = await userFilter.json();

        if (filterRes.length > 0) {
            // User already present
            return res.status(200)
                .render('signup', { msg: "User already Present" });

        } else {
            // GENERATE A SALT FOR THE PASSWORD
            let salt = await bcrypt.genSalt();
            // HASH THE PASSWORD
            let hashPass = await bcrypt.hash(password, salt);
            // console.log(hashPass);

            // DEFINE NEW USER OBJECT WITH ASHED PASSWORD
            let newUser = {
                displayName: `${displayName}`,
                email: `${email.toLowerCase()}`,
                password: `${hashPass}`,
                picture: `${''}`,
                createdAt: Date.now()
            };
            // console.log(newUser)
            // ADD NEW USER
            let userFetch = await fetch(url, {
                method: 'POST',
                body: JSON.stringify(newUser),
                headers: { 'Content-Type': 'application/json' }
            });
            // console.log(userFetch);
            if (userFetch) {
                return res.status(200)
                    .render('login', { msg: "New User created Successfully." });
            }

        };
    } catch (err) {
        if (err) throw err;
        res.send(500).json({ msg: `Wrong things happen ${err}...` })
    }

});

// GET LOGIN SIGN IN
router.get('/login', (req, res) => {
    res
        .status(200)
        .render('login.ejs', {
            user: req.user
        });
});

// POST LOGIN SIGN IN
router.post('/login', async(req, res) => {
    try {
        // Define values
        let email = req.body.email;
        let passw = req.body.password;
        // console.log(email, passw);
        // Check if user is already present
        // URL TO FETCH
        let url = `http://localhost:3000/users`;
        let filterUrl = url + `?email=${email}`;
        let userFilter = await fetch(filterUrl);
        let filterRes = await userFilter.json();

        if (filterRes.length > 0) {
            // COMPARE PASSWORD USING BCRYPT
            // console.log(passw, filterRes)
            let compare = await bcrypt.compare(passw, filterRes[0].password);
            if (compare) {
                let email = filterRes[0].email;
                // JWT ACCESS TOKEN
                let accessToken = jwt.sign({ email: email }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXP
                });
                // COOKIE OPTIONS
                let options = {
                        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXP * 24 * 60 * 60 * 1000), // ONE DAY
                        httpOnly: true
                    }
                    // RETURN
                return res
                    .status(200)
                    .cookie('token', accessToken, options)
                    .redirect('/');
            }
            // Password Wrong
            return res.status(400)
                .render('login', {
                    msg: 'Wrong password.'
                });


        } else {
            // User wrong
            return res.status(400)
                .render('login', {
                    msg: 'Wrong user.'
                });
        };

    } catch (err) {
        if (err) throw err;
        res.send(500).json({ message: `Wrong things happen ${err}...` })
    }

});

// GET WHO IS IN ROUTE
router.get('/whoisin', authenticateToken, (req, res) => {
    res.status(200)
        .json({
            message: 'Success',
            user: req.user
        });
});

// GET LOG OUT
router.get('/logout', (req, res) => {
    console.log(req.user)
    req.user = undefined;
    // Reset cookie
    res.cookie('token', `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`, {
            expires: new Date(Date.now() + 1 * 1000), //
            httpOnly: true
        })
        .redirect('/users/login');
});


// Export
module.exports = router;