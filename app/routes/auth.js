var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


var User = require('../models/user');

function tokenMiddleware() {
    return (req, res, next) => {
      let params ={
        username: 'FEUP',
        password: 'qualquer1',
        company: 'TECH4U',
        instance: 'DEFAULT',
        grant_type: 'password',
        line: 'professional'
      };
  
      request.post({url: 'http://localhost:2018/WebApi/token', form:params}, (error, response, body) => {
        if (error) {
          console.error(error);
          return;
        } else {
          res.token = JSON.parse(body).access_token;
          next();
        }
      });
    }
  }

router.get('/register/form', function(req, res) {
    res.render('register');
});

router.post('/register', function(req, res) {
  var name = req.body.name;
	var email = req.body.email;
	var password = req.body.password;

  var newUSer = new User({
       name: name, 
       email: email, 
       password:  password
  });

  User.createUser(newUSer, function(err,user){
    if(err) throw err;
    console.log(user);
  });

  res.redirect('/users');
  
});

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.getUserById(id, function (err, user) {
    done(err, user);
  });
});
  

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.getUserByEmail(username, function (err, user) {
			if (err) throw err;
			if (!user) {
        console.log("fds");
				return done(null, false, { message: 'Invalid email/password combination' });
			}

			User.comparePassword(password, user.password, function (err, isMatch) {
				if (err) throw err;
				if (isMatch) {
					return done(null, user);
				} else {
					return done(null, false, { message: 'Invalid email/password combination' });
				}
			});
		});
  }
));

router.post('/login',
passport.authenticate('local', { successRedirect: '/users', failureRedirect: '/'}),
	function (req, res) {
		res.redirect('/users');
	});

router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});
  

module.exports = router;
