const log = require('../config/logger.js');

const ErrorHandler = (err, req, res, next) => {
  log.error(`${err}`);
  console.log(`${err}`);
  err.ip = req.ip;
  res.status(err.status || 500);
  res.render('error', { error: err });
};

module.exports = ErrorHandler;
