var express = require('express');
var request = require('request');
var router = express.Router();

/* GET user page. */
router.get('/', function(req, res) {
    res.render('user');
  });
module.exports = router;