var express = require('express');
var passport = require('passport');
var request = require('request');
var router = express.Router();
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

router.post('/register',tokenMiddleware(), function(req, res) {

  var newUSer = new User({
     name: req.body.name,
     email: req.body.username,
     password: req.body.password
  });

  User.createUser(newUSer, function(err,user){
    if(err) throw err;

    let data=  {
      Cliente: user.id,
      Nome:  req.body.name,
      Morada:  req.body.address,
      Localidade:  req.body.city,
      CodigoPostal:  req.body.zip,
      NumContribuinte:  req.body.nif,
      CondPag: 2,
      Moeda: "EUR"
    };
  
    let options = {
      method: 'post',
      body: data,
      json: true,
      url: 'http://localhost:2018/WebApi/Base/Clientes/Actualiza',
      headers: {'Authorization': 'Bearer ' + res.token}
    };
  
    request(options, (error, response, body) => {
      if (error) {
        console.error(error);
        return;
      } else {
        passport.authenticate('local')(req, res, function () {
          res.redirect('/user/profile');
        }) 
      }
    });
  });
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
passport.authenticate('local'),
	function (req, res) {
		res.redirect('/user/profile/' + req.user.id);
	});

router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});
  

module.exports = router;
