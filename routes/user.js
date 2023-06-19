const express = require('express');
const router = express.Router();
const log = require('../config/logger.js')(module);

router.get('/', async (req, res) => {
  if (!req.userData.isRegistered) {
    res.redirect('/auth/login');
  } else {
    let data = {
      title: 'User',
      msg: 'Page to come.',
    };
    res.render('user', { data, user: req.userData });
  }
});

module.exports = router;
