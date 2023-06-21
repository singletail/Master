const { format, transports } = require('winston')
const { logger } = require('express-winston')
const config = require('.')
const { color } = require('./colors')

const consoleFormat = format.printf(
    ({ message, timestamp }) =>
        `${color('red')}[${timestamp}]${color('r')}${message}`
)

const fileFormat = format.printf(
    ({ message, timestamp }) => `[${timestamp}]${message}`
)

const expressLog = logger({
    transports: [
        new transports.Console({
            format: format.combine(
                format.timestamp({
                    format: `YYYY-MM-DD][HH:mm:ss`,
                }),
                consoleFormat
            ),
        }),
        new transports.File({
            filename: config.log.file,
            format: format.combine(
                format.timestamp({
                    format: `YYYY-MM-DD][HH:mm:ss`,
                }),
                fileFormat
            ),
        }),
    ],
    meta: false,
    msg: `[⺍REQUEST][{{req.ip}}][{{req.method}}][{{req.url}}][{{res.statusCode}}][{{res.responseTime}}ms] `,
    expressFormat: false,
    colorize: false,
})

module.exports = expressLog
