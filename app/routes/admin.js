var express = require('express');
var request = require('request');
var router = express.Router();

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

router.get('/', tokenMiddleware(), function (req, res) {
	let query = 'SELECT Nome, Fac_Mor, Fac_Local, Fac_Cp, Fac_Tel, NumContrib, Pais, Moeda FROM Clientes';

	let options = {
		method: 'post',
		body: query,
		json: true,
		url: 'http://localhost:2018/WebApi/Administrador/Consulta',
		headers: { 'Authorization': 'Bearer ' + res.token }
	};

	request(options, (error, response, body) => {
		if (error) {
			console.error(error);
			return;
		} else {
			res.render('list_users');
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
