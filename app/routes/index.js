var express = require('express');
var request = require('request');
var router = express.Router();

/* GET index page. */

/*
router.get('/', function(req, res) {
  res.render('index');
});*/

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

function authenticationMiddleware(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		res.redirect('/users');
	}
}

router.get('/',tokenMiddleware(), function(req,res){

	let query = 'SELECT TOP(4) Artigo, Descricao, PrecUnit, SUM(Quantidade) AS TotalQuantity FROM LinhasDoc GROUP BY Artigo, Descricao, PrecUnit ORDER BY SUM(Quantidade) DESC';

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
			var products = body.DataSet.Table;  
      res.render('index',{products});
	  }
	});
});



module.exports = router;
