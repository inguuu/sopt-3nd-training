var express = require('express');
var router = express.Router();
router.use('/board',require('./board'));
/* GET home page. */
router.get('/', function(req, res, next) {
    res.send('homework index');
  });

module.exports = router;