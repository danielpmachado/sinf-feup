var express = require('express');
var request = require('request');
var router = express.Router();

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

router.get('/computers',tokenMiddleware(), function(req,res){
  let query = 'SELECT a.Artigo, a.Descricao, a.marca, am.PVP1 FROM Artigo as a  INNER JOIN Familias ON a.Familia = Familias.Familia INNER JOIN ArtigoMoeda as am ON a.Artigo = am.Artigo WHERE Familias.Familia =' + '\'' + 'F001' + '\'';

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
        var products = body.DataSet.Table[0];
        res.render('catalog',{category: 'Computers',products});
      }
    });
});

module.exports = router;