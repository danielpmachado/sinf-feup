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


router.get('/product',tokenMiddleware(), function(req,res){
  let query = 'SELECT Descricao, PVP1, Modelo, Marca FROM Artigo INNER JOIN ArtigoMoeda ON Artigo.Artigo = ArtigoMoeda.Artigo WHERE Artigo.Artigo=' + '\'' + 'A0001' + '\'';

  let options = {
    method: 'post',
    body: query,
    json: true,
    url: 'http://localhost:2018/WebApi/Administrador/Consulta',
    headers: {'Authorization': 'Bearer ' + res.token}
  };
 
  console.log(res.token);
 
  request(options, (error, response, body) => {
    var context = {};
    if (error) {
      console.error(error);
      return;
    } else {
      context = body.DataSet.Table[0];
      res.render('product', context);
    }
  });
});


router.get('/catalog/Computers',tokenMiddleware(), function(req,res){
  let query = 'SELECT a.Artigo, a.Descricao, a.marca,  a.PVP1 FROM Artigo as a  INNER JOIN Familias ON a.Familia = Familias.Familia INNER JOIN ArtigoMoeda as am ON a.Artigo = am.Artigo WHERE Familias.Famila =' + '\'' + 'F001' + '\'';

  let options = {
    method: 'post',
    body: query,
    json: true,
    url: 'http://localhost:2018/WebApi/Administrador/Consulta',
    headers: {'Authorization': 'Bearer ' + res.token}
  };

 console.log(res.token);

  request(options, (error, response, body) => {
      if (error) {
        console.error(error);
        return;
      } else {
       console.log(body.DataSet.Table[0]);
      }
    });
  res.render('catalog/Computers');
});

router.get('/catalog/Accessories',tokenMiddleware(), function(req,res){
  let query = 'SELECT a.Artigo, a.Descricao, a.marca,  a.PVP1 FROM Artigo as a  INNER JOIN Familias ON a.Familia = Familias.Familia INNER JOIN ArtigoMoeda as am ON a.Artigo = am.Artigo WHERE Familias.Famila =' + '\'' + 'F004' + '\'';

  let options = {
    method: 'post',
    body: query,
    json: true,
    url: 'http://localhost:2018/WebApi/Administrador/Consulta',
    headers: {'Authorization': 'Bearer ' + res.token}
  };

 console.log(res.token);

  request(options, (error, response, body) => {
      if (error) {
        console.error(error);
        return;
      } else {
       console.log(body.DataSet.Table[0]);
      }
    });
  res.render('catalog/Accessories');
});

router.get('/catalog/Mobile',tokenMiddleware(), function(req,res){
  let query = 'SELECT a.Artigo, a.Descricao, a.marca,  a.PVP1 FROM Artigo as a  INNER JOIN Familias ON a.Familia = Familias.Familia INNER JOIN ArtigoMoeda as am ON a.Artigo = am.Artigo WHERE Familias.Famila =' + '\'' + 'F002' + '\'';

  let options = {
    method: 'post',
    body: query,
    json: true,
    url: 'http://localhost:2018/WebApi/Administrador/Consulta',
    headers: {'Authorization': 'Bearer ' + res.token}
  };

 console.log(res.token);

  request(options, (error, response, body) => {
      if (error) {
        console.error(error);
        return;
      } else {
       console.log(body.DataSet.Table[0]);
      }
    });
  res.render('catalog/Mobile');
});

router.get('/catalog/Components',tokenMiddleware(), function(req,res){
  let query = 'SELECT a.Artigo, a.Descricao, a.marca,  a.PVP1 FROM Artigo as a  INNER JOIN Familias ON a.Familia = Familias.Familia INNER JOIN ArtigoMoeda as am ON a.Artigo = am.Artigo WHERE Familias.Famila =' + '\'' + 'F005' + '\'';

  let options = {
    method: 'post',
    body: query,
    json: true,
    url: 'http://localhost:2018/WebApi/Administrador/Consulta',
    headers: {'Authorization': 'Bearer ' + res.token}
  };

 console.log(res.token);

  request(options, (error, response, body) => {
      if (error) {
        console.error(error);
        return;
      } else {
       console.log(body.DataSet.Table[0]);
      }
    });
  res.render('catalog/Components');
});



module.exports = router;
