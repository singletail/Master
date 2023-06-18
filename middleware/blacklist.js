const Banned = require('../models/ban.js');

const blacklist = async (req, res, next) => {
  let ban = await Banned.findOne({ ip: req.ip });
  if (ban) {
    req.userData.isBanned = true;
    ban.$inc('attempts', 1);
    ban.last = Date.now();
    ban.save();
    var err = new Error('Banned');
    err.status = 401;
    next(err);
  } else {
    next();
  }
};

module.exports = blacklist;
