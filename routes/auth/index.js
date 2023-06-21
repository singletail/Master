const express = require('express');

const router = express.Router();

router.get('/login', async (req, res) => {
  const data = {
    title: 'Login',
    msg: 'Select Authentication Method.',
  };
  res.render('login', { data, user: req.userData });
});

module.exports = router;
