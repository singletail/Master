const log = require('../config/logger.js')(module);

const ErrorHandler = (err, req, res, next) => {
  log.error(`${req.ip} ${req.url} ${err}`);
  err.ip = req.ip;
  err.note = '';
  err.debug = err.stack;
  if (err.status === 401) {
    err.message = 'Fuck You';
    err.note =
      'You will never amount to anything in life.\n\nDo your family a favor.\n\nKill yourself.\n\nToday.\n\nNow.';
    err.debug = '';
  }
  res.status(err.status || 500);
  res.render('error', { error: err, user: req.userData });
};

module.exports = ErrorHandler;
