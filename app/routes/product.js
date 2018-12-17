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

router.get('/page',tokenMiddleware(), function(req,res){
  var productID = req.query.productID;
  let query = 'SELECT a.Artigo, a.Descricao, am.PVP1, m.Descricao, f.Descricao FROM Artigo a INNER JOIN Marcas m ON m.Marca=a.Marca INNER JOIN Familias f ON f.Familia=a.Familia INNER JOIN ArtigoMoeda as am ON a.Artigo = am.Artigo WHERE a.Artigo=' + '\'' + productID + '\'';

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
      var context = body.DataSet.Table[0];
      if(context != null)
        context.Artigo = productID;
      res.render('product', context);
    }
  });
});



module.exports = router;