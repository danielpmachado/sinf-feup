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

/* GET cart page. */
router.get('/', tokenMiddleware(), function(req, res) {
  try {
    var cart = JSON.parse(req.cookies['cart']);
  } catch (err) {
    cart = null; 
  }
  console.log(cart);
  if(cart != null){
    var products = [];
    cart.forEach(function(element, index, a) {
      console.log(element);
      var productID = element.id;
      let query = 'SELECT a.Artigo, a.Descricao, am.PVP1, m.Descricao FROM Artigo a INNER JOIN Marcas m ON m.Marca=a.Marca  INNER JOIN ArtigoMoeda as am ON a.Artigo = am.Artigo WHERE a.Artigo=' + '\'' + productID + '\'';

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
          context.count = cart[index].count;
          products.push(context);
          if(index == a.length - 1){
            console.log(products);
            res.render('cart', {'products': products});
          }
        }
      });
    });
  } else
    res.render('cart', null);
});

module.exports = router;