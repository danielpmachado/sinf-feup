var express = require('express');
var request = require('request');
var router = express.Router();

/* GET index page. */
router.get('/', function(req, res) {
  res.render('index');
});

function tokenMiddleware() {
  return (req, res, next) => {
    let params ={
      username: 'FEUP',
      password: 'qualquer1',
      company: 'BELAFLOR',
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


router.get('/user/:userID',tokenMiddleware(), function(req,res){
  let query = 'SELECT Nome, Fac_Mor, Fac_Local, Fac_Cp, Fac_Tel, NumContrib, Pais, Moeda FROM Clientes WHERE Clientes.Cliente=' + '\'' + req.params.userID + '\'';

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
      var context = body.DataSet.Table[0];
      res.render('user', context);
    }
  });
});

router.get('/user/:userID/orders',tokenMiddleware(), function(req,res){
  let query = ' SELECT CONVERT(VARCHAR(10),cd.Data,103), cd.TotalMerc, cd.TotalIva, cd.TotalDocumento, cd.ModoPag, cd.NumContribuinte, cd.MoradaEntrega, cd.LocalidadeEntrega, cd.CodPostalEntrega, cds.Estado FROM CabecDoc cd INNER JOIN CabecDocStatus cds ON cd.id = cds.IdCabecDoc  WHERE cd.Entidade=' + '\'' + req.params.userID + '\'';

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
      var context = body.DataSet.Table[0];
      res.render('user_orders', context);
    }
  });
});

module.exports = router;
