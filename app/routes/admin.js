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

function adminMiddleware() {
	return (req, res, next) => {
		if(req.user.id == 0){
			return next();
		} else {
			res.redirect('/');
		}
}};

router.get('/manage/users', adminMiddleware(), function (req, res) {
	User.find({}, function(err, users) {
		res.render('admin/manage_users', {users});
	});
});
/*
router.get('/best_selling_products',adminMiddleware(), function(req, res) {
	res.render('best_sellers');
});*/

router.get('/top_category',adminMiddleware(), function(req, res) {
	// let userID = req.params.userID;
	// let query = 'SELECT TOP(1) f.familia FROM Familias as f INNER JOIN Artigo as a ON f.familia=a.familia INNER JOIN LinhasDoc as ld ON ld.artigo=a.artigo GROUP BY f.familia ORDER BY SUM(ld.quantidade) ';
	//
	// let options = {
	//   method: 'post',
	//   body: query,
	//   json: true,
	//   url: 'http://localhost:2018/WebApi/Administrador/Consulta',
	//   headers: {'Authorization': 'Bearer ' + res.token}
	// };
	//
	// request(options, (error, response, body) => {
	//   if (error) {
	// 	console.error(error);
	// 	return;
	//   } else {
	// 		var category = body.DataSet.Table;
  //       console.log(category);
  //       res.render('admin/top_category',{category}); // change to best sellers
	//   }
	// });
	res.render('admin/top_category');

});

router.get('/manage_orders',[adminMiddleware(),tokenMiddleware()], function(req, res) {
	
	let query = 'SELECT CONVERT(VARCHAR(10),cd.Data,103), cd.TotalMerc, cd.TotalIva, cd.TotalDocumento, cd.ModoPag, cd.NumContribuinte, cd.MoradaEntrega, cd.LocalidadeEntrega, cd.CodPostalEntrega, cds.Estado FROM CabecDoc cd INNER JOIN CabecDocStatus cds ON cd.id = cds.IdCabecDoc';

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

			console.log(body);
			var orders = body.DataSet.Table; 
			console.log(orders); 
      res.render('manage_orders',{orders});
	  }
	});
});

router.get('/ban/:userID',adminMiddleware(),function(req,res){
	console.log(req.params.userID);
	User.findOneAndRemove({_id: req.params.userID}, (err) => {
		if (err) {
		  return res.redirect("/");
		}
		console.log("User Account Deleted");
		return res.redirect("/");
	  });
});


router.get('/manage/products',[adminMiddleware(),tokenMiddleware()], function(req,res){

	let query = 'SELECT a.Artigo, a.Descricao,aa.Armazem, SUM(aa.StkActual) FROM Artigo a INNER JOIN V_INV_ArtigoArmazem aa ON aa.Artigo = a.Artigo  GROUP BY a.Artigo,a.Descricao,aa.Armazem';

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
			res.render('admin/manage_products',{products});
	  }
	});
});


router.get('/best_selling_products',tokenMiddleware(), function(req,res){

	let query = 'SELECT TOP(2) Artigo, Descricao, SUM(300) AS TotalQuantity FROM LinhasDoc GROUP BY Artigo, Descricao ORDER BY SUM(300) DESC';

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
      res.render('best_sellers',{products});
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
