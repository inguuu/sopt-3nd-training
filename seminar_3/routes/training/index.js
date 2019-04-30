var express = require('express');
var router = express.Router();
router.use('/info',require('./info'));
/* GET home page. */
router.get('/', function(req, res, next) {
    res.send('training index');
  });

module.exports = router;
