var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('topic', { title: 'Express js' });
});

module.exports = router;
