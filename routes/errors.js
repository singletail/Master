const express = require('express');
var router = express.Router();

// 400 - Bad Request
router.get('/400', function (req, res, next) {
  var err = new Error('Bad Request');
  err.status = 400;
  next(err);
});

// 404 Catch-All
router.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

module.exports = router;
