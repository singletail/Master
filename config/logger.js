const { createLogger, format, transports } = require('winston')
const config = require('.')
const g = require('./glyphs')
const { color, bgcolor } = require('./colors')

const levelString = (level) => {
    const str = level.toUpperCase()
    switch (level) {
        case 'emerg':
            return `${bgcolor('red')}[${g(level)}${str}]${color('r')}`
        case 'alert':
            return `${bgcolor('orange')}[${g(level)}${str}]${color('r')}`
        case 'crit':
            return `${bgcolor('yellow')}[${g(level)}${str}]${color('r')}`
        case 'error':
            return `${color('red')}[${g(level)}${str}]${color('r')}`
        case 'warn':
            return `${color('orange')}[${g(level)}${str}]${color('r')}`
        case 'notice':
            return `${color('cyan')}[${g(level)}${str}]${color('r')}`
        case 'info':
            return `${color('green')}[${g(level)}${str}]${color('r')}`
        case 'debug':
            return `${color('violet')}[${g(level)}${str}]${color('r')}`
        default:
            return `${color('blue')}[${g(level)}${str}]${color('r')}`
    }
}

const fileFormat = format.printf(
    ({ level, message, label, timestamp }) =>
        `[${timestamp}]${label}[${level}]: ${message}`
)

const consoleFormat = format.printf(
    ({ level, message, label, timestamp }) =>
        `${color('red')}[${timestamp}]${color('r')}${label}${levelString(
            level
        )} ${message}${color('r')}`
)

const colorLabel = (filename) => {
    const pA = filename.split('/')
    return `${color('orange')}[${pA[pA.length - 2]}]${color('r')}${color(
        'yellow'
    )}[${pA[pA.length - 1]}]${color('r')}`
}

const plainLabel = (filename) => {
    const pA = filename.split('/')
    return `[${pA[pA.length - 2]}][${pA[pA.length - 1]}]`
}

const log = (mod) =>
    createLogger({
        transports: [
            new transports.Console({
                format: format.combine(
                    format.timestamp({ format: 'YYYY-MM-DD][HH:mm:ss' }),
                    format.label({ label: colorLabel(mod.filename) }),
                    consoleFormat
                ),
            }),
            new transports.File({
                filename: config.log.file,
                format: format.combine(
                    format.timestamp({ format: 'YYYY-MM-DD][HH:mm:ss' }),
                    format.label({ label: plainLabel(mod.filename) }),
                    fileFormat
                ),
            }),
        ],
    })

module.exports = log
