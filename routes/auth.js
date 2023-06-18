const express = require('express');
const router = express.Router();
const log = require('../config/logger.js');

router.get('/login', async (req, res) => {
  let data = {
    title: 'Login',
    msg: 'Select Authentication Method.',
  };
  res.render('login', { data, user: req.userData });
});

module.exports = router;
