const expressWinston = require('express-winston');
const winston = require('winston');

const fileFormat = winston.format.printf(
  ({ level, message, label, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
  }
);

const consoleFormat = winston.format.printf(
  ({ level, message, label, timestamp }) => {
    return `[${timestamp}]${message}`;
  }
);

const expressLog = expressWinston.logger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: '/var/dev/ai/server/log.log',
    }),
  ],
  format: winston.format.combine(
    winston.format.timestamp({
      format: `YYYY-MM-DD][HH:mm:ss`,
    }),
    consoleFormat
  ),
  meta: false,
  msg: `[{{req.ip}}][{{req.method}}][{{req.url}}][{{res.statusCode}}][{{res.responseTime}}ms] `,
  expressFormat: false,
  colorize: false,
});

module.exports = expressLog;
