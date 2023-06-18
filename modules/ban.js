const Banned = require('../models/ban.js');
const log = require('../config/logger.js');

const banip = async (ip, reason, request) => {
  let ban = new Banned({ ip: ip, reason: reason, request: request });
  ban.save();
  log.warn(`New ban ${ip} ${reason} ${request}`);
};

module.exports = banip;
