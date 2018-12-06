var express = require('express');
var request = require('request');
var router = express.Router();

/* GET index page. */
router.get('/', function(req, res) {
  res.render('index');
});

/* GET home Page */
router.get('/token', function(req, res) {
  res.render('token');
});

router.get('/token',function(req,res){
  let params ={
    username: 'FEUP',
    password: 'qualquer1',
    company: 'BELAFLOR',
    instance: 'DEFAULT',
    grant_type: 'password',
    line: 'professional'
  };

  
  let headersOpt = {
    'content-type': 'application/x-www-form-urlencoded',
  };

  request.post({url: 'http://localhost:8080/WebApi/token', form:params}, (error, response, body) => {
    if (error) {
      console.error(error);
      return;
    } else {
      res.send(body);
      res.status(200);
    }
  });

});


module.exports = router;
