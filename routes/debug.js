const express = require('express');
let router = express.Router();
const log = require('../config/logger.js');

router.get('/cert', async (req, res) => {
  console.debug(req);
  let data = {
    title: 'Cert',
    msg: req,
  };
  res.render('debug', { data, user: req.userData });
});

module.exports = router;
