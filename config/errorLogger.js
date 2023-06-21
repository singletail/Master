const { errorLogger } = require('express-winston')
const { format, transports } = require('winston')
const config = require('.')

const consoleFormat = format.printf(
    ({ message, timestamp }) => `[${timestamp}]${message}`
)

const errorLog = errorLogger({
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

module.exports = errorLog
