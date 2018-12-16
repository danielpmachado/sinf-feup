var express = require('express');
var request = require('request');
var router = express.Router();

/* GET cart page. */
router.get('/', function(req, res) {
    var cart = JSON.parse(req.cookies['cart']);
    newcart = {'cart': cart}
    console.log(newcart);
    res.render('cart', newcart);
  });

module.exports = router;