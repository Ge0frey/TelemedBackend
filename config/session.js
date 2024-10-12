const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const db = require('./database');

const sessionStore = new MySQLStore({}, db);

module.exports = session({
  key: 'session_cookie_name',
  secret: process.env.SESSION_SECRET,
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    httpOnly: true,
  }
});