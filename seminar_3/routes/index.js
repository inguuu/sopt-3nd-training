var express = require('express');
var router = express.Router();

/* GET home page. */
router.use('/training',require('./training/index'));
router.use('/homework',require('./homework/index'));
router.get('/', function(req, res, next) {
  res.send('main index');
});

module.exports = router;



