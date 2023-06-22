import log from '../config/logger.mjs'
// import * as logger from '../config/logger.mjs'

// const log = logger(module)

const ErrorHandler = (err, req, res, next) => {
  log.error(`${req.ip} ${req.url} ${err}`)
  const msg = {
    status: err.status || 500,
    message: err.message || 'Something went wrong',
    note: err.note || '',
    debug: err.stack || '',
  }
  if (err.status === 401) {
    msg.message = 'Kill Yourself'
    msg.note =
      'You will never amount to anything in life.\n\nDo your family a favor.\n\nOff yourself.\n\nToday.\n\nNow.'
    msg.debug = ''
  }
  res.status(err.status || 500)
  res.render('error', { err, msg, user: req.userData })
  next()
}

export default ErrorHandler
