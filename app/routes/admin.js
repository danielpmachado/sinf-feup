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


router.get('/top_category',[adminMiddleware(),tokenMiddleware()], function(req, res) {
	let userID = req.params.userID;
	let query = 'SELECT TOP(1) f.familia FROM Familias as f INNER JOIN Artigo as a ON f.familia=a.familia INNER JOIN LinhasDoc as ld ON ld.artigo=a.artigo GROUP BY f.familia ORDER BY SUM(ld.quantidade) ';

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

			var category = body.DataSet.Table[0];
      console.log(category);
			console.log(category.familia);


	let query2 = 'SELECT a.Artigo, a.Descricao, am.PVP1 FROM Artigo as a INNER JOIN Familias ON a.Familia = Familias.Familia INNER JOIN ArtigoMoeda as am ON a.Artigo = am.Artigo WHERE Familias.familia =' + '\'' + category.familia + '\'';

	let options2 = {
		method: 'post',
		body: query2,
		json: true,
		url: 'http://localhost:2018/WebApi/Administrador/Consulta',
		headers: {'Authorization': 'Bearer ' + res.token}
	};

	request(options2, (error, response, body) => {
			if (error) {
				console.error(error);
				return;
			} else {
				var products = body.DataSet.Table;
				console.log(products);
				res.render('admin/top_category',{products});
			}
		});
	}
	});
});

router.get('/manage_orders',[adminMiddleware(),tokenMiddleware()], function(req, res) {

	let orderState = "P";
	let query = 'SELECT CONVERT(VARCHAR(10),cd.Data,103), cd.Id, cd.TotalMerc, cd.TotalIva, cd.TotalDocumento, cd.ModoPag, cd.NumContribuinte, cd.MoradaEntrega, cd.LocalidadeEntrega, cd.CodPostalEntrega, cds.Estado FROM CabecDoc cd INNER JOIN CabecDocStatus cds ON cd.id = cds.IdCabecDoc WHERE cds.Estado =' + '\'' + orderState + '\'';

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
      res.render('admin/manage_orders',{orders});
	  }
	});
});

router.get('/manage_orders/cancelled_orders',[adminMiddleware(),tokenMiddleware()], function(req, res) {

	let orderState = "R";
	let query = 'SELECT CONVERT(VARCHAR(10),cd.Data,103), cd.Id, cd.TotalMerc, cd.TotalIva, cd.TotalDocumento, cd.ModoPag, cd.NumContribuinte, cd.MoradaEntrega, cd.LocalidadeEntrega, cd.CodPostalEntrega, cds.Estado FROM CabecDoc cd INNER JOIN CabecDocStatus cds ON cd.id = cds.IdCabecDoc WHERE cds.Estado =' + '\'' + orderState + '\'';

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
      res.render('admin/manage_orders_cancelled',{orders});
	  }
	});
});

router.get('/manage_orders/transformed_orders',[adminMiddleware(),tokenMiddleware()], function(req, res) {

	let orderState = "T";
	let query = 'SELECT CONVERT(VARCHAR(10),cd.Data,103), cd.Id, cd.TotalMerc, cd.TotalIva, cd.TotalDocumento, cd.ModoPag, cd.NumContribuinte, cd.MoradaEntrega, cd.LocalidadeEntrega, cd.CodPostalEntrega, cds.Estado FROM CabecDoc cd INNER JOIN CabecDocStatus cds ON cd.id = cds.IdCabecDoc WHERE cds.Estado =' + '\'' + orderState + '\'';

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
      res.render('admin/manage_orders_transf',{orders});
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


router.get('/best_selling_products',[adminMiddleware(),tokenMiddleware()], function(req,res){

	let query = 'SELECT TOP(3) Artigo, Descricao, PrecUnit, SUM(Quantidade) AS TotalQuantity FROM LinhasDoc GROUP BY Artigo, Descricao, PrecUnit ORDER BY SUM(Quantidade) DESC';

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
      res.render('admin/best_sellers',{products});
	  }
	});
});


router.get('/add_product/form',adminMiddleware(), function(req, res) {
	res.render('admin/add_product');
});

router.get('/product_price/form',adminMiddleware(), function(req, res) {
	res.render('admin/product_price');
});

router.post('/add_product/validate',tokenMiddleware(), function (req, res) {

	let data = {
	
			Artigo: "A127",
			Descricao: req.body.name,
			Caracteristicas: "",
			Observacoes: req.body.description,
			CodBarras: "",
			UnidadeBase: "UN",
			UnidadeVenda: "UN",
			UnidadeCompra: "UN",
			UnidadeEntrada: "UN",
			UnidadeSaida: "UN",
			Marca: req.body.brand,
			Familia: req.body.category,
			Peso:req.body.score,
			IVA: "23",
			MovStock: "S"
	}

	console.log(data);


	let options = {
		method: 'post',
		body: data,
		json: true,
		url: 'http://localhost:2018/WebApi/Base/Artigos/Actualiza',
		headers: {'Authorization': 'Bearer ' + res.token}
	};

	request(options, (error, response, body) => {
		if (error) {
			console.error(error);
			return;
		} else {
			console.log('NICE !!!!!');
			res.redirect('/admin/product_price/form');
		}
	});
});

router.post('/add_price',tokenMiddleware(), function (req, res) {

	let data = {
	
		Artigo: "A127",
		Moeda: "EUR",
		Unidade: "UN",
		Descricao: "",
		PVP1: req.body.price
	}

	console.log(data);


	let options = {
		method: 'post',
		body: data,
		json: true,
		url: 'http://localhost:2018/WebApi/Base/ArtigosPrecos/Actualiza',
		headers: {'Authorization': 'Bearer ' + res.token}
	};

	request(options, (error, response, body) => {
		if (error) {
			console.error(error);
			return;
		} else {
			console.log('NICE !!!!!');
			res.redirect('/');
		}
	});
});


router.post('/manage/products/:productID', tokenMiddleware(), function(req, res) {

	let id = req.params.productID;
	let quantity = req.body.quantity;

	let body ={
			"Linhas": [{"Artigo": id, "Quantidade":quantity}],
			"Tipodoc": "ECF",
			"Entidade": "F001",
			"TipoEntidade": "F",
			"CondPag": 2
	}

	let body_transform ={
		"Tipodoc": "VFA",
		"Serie": "A",
		"Entidade": "F001",
		"TipoEntidade": "F"
	}

  let options = {
    method: 'post',
    body: body,
    json: true,
    url: 'http://localhost:2018/WebApi/Compras/Docs/CreateDocument',
    headers: {'Authorization': 'Bearer ' + res.token}
  };

  request(options, (error, response, body) => {
    if (error) {
      return;
    } else {

		 res.render('partials/other/success',{message: "Stock order has been successufuly placed"} );
    }
  });


});

module.exports = router;
