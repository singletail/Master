const express = require('express');
const banip = require('../modules/ban.js');
let router = express.Router();

router.get('/wp-*', async (req, res, next) => {
  let reason = 'Wordpress Hack';
  banip(req.ip, req.url, reason);
  var err = new Error('Banned.');
  err.status = 401;
  next(err);
});

module.exports = router;
