var express = require('express');
var request = require('request');
var router = express.Router();

var User = require('../models/user');

function tokenMiddleware() {
	return (req, res, next) => {
		let params = {
			username: 'FEUP',
			password: 'qualquer1',
			company: 'TECH4U',
			instance: 'DEFAULT',
			grant_type: 'password',
			line: 'professional'
		};

		request.post({ url: 'http://localhost:2018/WebApi/token', form: params }, (error, response, body) => {
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

router.get('/manage_users', tokenMiddleware(), function (req, res) {
	User.find({}, function(err, users) {
		let context = users;
		console.log(context[0].name);
		res.render('list_users', {users});
	});
});

router.get('/best_selling_products', function(req, res) {
	res.render('best_sellers');
});

router.get('/top_category', function(req, res) {
	res.render('top_category');
});

router.get('/manage_orders', function(req, res) {
	res.render('manage_orders');
});


/*
/*
router.get('/best_selling_products',tokenMiddleware(), function(req,res){
	let userID = req.params.userID;
	let query = 'SELECT TOP(NUM) Artigo, Descricao, SUM(Quantidade) AS TotalQuantity FROM LinhasDoc GROUP BY Artigo, Descricao ORDER BY SUM(Quantidade) DESC';
  
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
        console.log(products);
        res.render('catalog',{category: 'Computers', products}); // change to best sellers
	  }
	});
  });



/*
router.get('/add_product', tokenMiddleware(), function (req, res) {

	let options = {
		method: 'post',
		body: {"Artigo": <ID>,
			"Descricao": <ITEM>,
			"UnidadeBase": "UN",
			"UnidadeVenda": "UN",
			"UnidadeCompra": "UN",
			"UnidadeEntrada": "UN",
			"UnidadeSaida": "UN",
			"IVA": <IVA>,
			"MovStock": "S",
		"Marca": <BRAND>},
		json: true,
		url: 'http://localhost:2018/WebApi/Artigos/Actualiza',

		headers: { 'Authorization': 'Bearer ' + res.token }
	};

	request(options, (error, response, body) => {
		if (error) {
			console.error(error);
			return;
		} else {
			var products = body.DataSet.Table;
			res.render('product_admin', context);
		}
	});
});
*/

module.exports = router;
