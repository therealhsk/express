var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
var passport = require('passport');
var User = require('../models/user');
var authenticate = require('../authenticate')

router.use(bodyParser.json());

/* GET users listing. */
router.get('/', authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  User.find({})
    .then((users) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(users);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = router;

router.post('/signup', (req, res, next) => {
  User.register(new User({ username: req.body.username }),
    req.body.password, (err, user) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({ err: err });
      }
      else {
        if (req.body.firstname)
          user.firstname = req.body.firstname;
        if (req.body.lastname)
          user.lastname = req.body.lastname;
        user.save((err, user) => {
          if (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({ err: err });
            return;
          }
          passport.authenticate('local')(req, res, () => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({ success: true, status: 'Registration Successful!' });
          });
        });
      }
    });
});

router.post('/login', passport.authenticate('local'), (req, res) => {

  var token = authenticate.getToken({ _id: req.user._id });
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({ success: true, token: token, status: 'You are successfully logged in!' });
});

router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTNjM2U1NTEwZTI0ZjIzZGZjYTk1ZDYiLCJpYXQiOjE1ODExMDMzOTUsImV4cCI6MTU4MTEwNjk5NX0.d11kgaqgWYbJ-RVoF0xwdjVozCkHLu8l4dXHk_4I64c
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTNkYjdmNzExZDc5YTEzOTlmNmYwMDYiLCJpYXQiOjE1ODExMDM1NTksImV4cCI6MTU4MTEwNzE1OX0.ndACOMpp0-71_I2IeEp2nJuHUPZiJSOwcCWvmXcMpUs
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTNkYjgyYzExZDc5YTEzOTlmNmYwMDciLCJpYXQiOjE1ODExMDUwODUsImV4cCI6MTU4MTEwODY4NX0.icD50_p1wP6uEkcYbYtVqVeQ6K9-VR_0yoIa4_duyPk

//5e3dc02411d79a1399f6f00c

//5e3dc0de11d79a1399f6f00f