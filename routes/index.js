const express = require('express');
let router = express.Router();
const log = require('../config/logger.js');
const path = require('node:path');

/*
router.get('/', async (req, res) => {
  let data = {
    title: 'O',
    msg: 'Hai',
    //  geo: req.geo,
    //  localTime: req.localTime,
  };
  res.render('index', { data });
  res.end();
});
*/

router.get('/', async (req, res) => {
  log.info(`reached index from ${req.ip}`);
  let data = {
    title: 'O',
    msg: 'Hai',
  };
  res.render('index', { data });
});

router.get('/temp', async (req, res, next) => {
  log.info(`reached temp from ${req.ip}`);
  log.warn('another');
  res.send('Server is running');
});

module.exports = router;
