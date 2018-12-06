var express = require('express');
var request = require('request');
var router = express.Router();

/* GET cart page. */
router.get('/', function(req, res) {
    res.render('cart');
  });

module.exports = router;