import expressWinston from 'express-winston'
import { format, transports } from 'winston'
import config from './config.mjs'

const consoleFormat = format.printf(
  ({ message, timestamp }) => `[${timestamp}]${message}`
)

const errorLog = expressWinston.errorLogger({
  transports: [
    new transports.Console(),
    new transports.File({
      filename: config.log.file,
    }),
  ],
  format: format.combine(
    format.timestamp({
      format: `YYYY-MM-DD][HH:mm:ss`,
    }),
    consoleFormat
  ),
  meta: false,
  msg: `[䆺 ERROR][{{req.ip}}][{{req.method}}][{{req.url}}][{{res.statusCode}}][{{res.responseTime}}ms] ⼌ {{err.status}} {{err.msg}} `,
  expressFormat: false,
  colorize: false,
})

export default errorLog
