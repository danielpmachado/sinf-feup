var express = require('express');
var request = require('request');
var router = express.Router();

/* GET product page. */
router.get('/', function(req, res) {
    res.render('admin/add_product');
  });

module.exports = router;
