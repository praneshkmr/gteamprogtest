var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  res.render('index',{ title : "Todo App" });
});

module.exports = router;
