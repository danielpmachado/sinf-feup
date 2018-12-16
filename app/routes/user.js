var express = require('express');
var request = require('request');
var router = express.Router();

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


router.get('/profile/:userID',tokenMiddleware(), function(req,res){
  let userID = req.params.userID;
  let query = 'SELECT Nome, Fac_Mor, Fac_Local, Fac_Cp, Fac_Tel, NumContrib FROM Clientes WHERE Clientes.Cliente=' + '\'' + userID + '\'';

  let options = {
    method: 'post',
    body: query,
    json: true,
    url: 'http://localhost:2018/WebApi/Administrador/Consulta',
    headers: {'Authorization': 'Bearer ' + res.token}
  };

  request(options, (error, response, body) => {
    if (error) {
      console.error(error);
      return;
    } else {
      User.getUserById(userID, function (err, user) {
        var client = body.DataSet.Table[0];
        var email = user.email;
        res.render('profile', {client, email} );
      });
    }
  });
});



module.exports = router;