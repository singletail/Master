//const Banned = require('../models/ban.js');

const real_ip = async (req, res, next) => {
  let ip = req.header('x-forwarded-for');
  req.real_ip = ip;

  /*
  let ban = await Banned.findOne({ ip: ip });
  if (ban) {
    ban.$inc('attempts', 1);
    ban.last = Date.now();
    ban.save();
    var err = new Error('Banned');
    err.status = 401;
    next(err);
  } else {
    next();
  }
  */
};

module.exports = { real_ip };
