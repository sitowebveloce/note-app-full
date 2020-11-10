// REQUIRE
require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
bodyParser = require('body-parser');

// APP
const app = express();

// Set view engine
app.set('view engine', 'ejs');
// Set public folder
app.use(express.static(__dirname + '/public'));
// Body parser
app.use(express.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
// GLOBAL VARIABLES
app.use(function(req, res, next) {
    res.locals.user = req.user || undefined;
    res.locals.msg = req.msg || undefined;
    next()
});
// ROUTEs
// HOME
let index = require('./routes/index');
// USER AUTHENTICATION
let users = require('./routes/auth');
app.use('/users', users);
app.use('/', index);

// ─── SERVER LISTENER ────────────────────────────────────────────

app.listen(process.env.PORT, () => {
    console.log(`Server beating ❤️ on port ${process.env.PORT}`)
});

// ─── JSON SERVER ───────────────────────────────────────────────
const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('./data/db.json')
const middlewares = jsonServer.defaults()

server.use(middlewares)
server.use(router)
server.listen(3000, () => {
    console.log('JSON Server beating ❤️ on port: 3000')
});