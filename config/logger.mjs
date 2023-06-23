import * as winston from 'winston'
import config from './config.mjs'
import g from './glyphs.mjs'
import { color, bgcolor } from './colors.mjs'

const levelStringColor = (level) => {
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

const levelString = (level) => `[${level.toUpperCase()}]`

const metaFormatColor = winston.format.printf(
  ({ level, message, label, timestamp, ...metadata }) => {
    let out = `${color('red')}[${timestamp}]`
    if (metadata.src !== undefined) {
      const pathArray = metadata.src.split('/')
      out += `${color('orange')}[${pathArray[pathArray.length - 2]}]${color(
        'yellow'
      )}[${pathArray[pathArray.length - 1]}]`
    }
    out += `${levelStringColor(level)} ${message}${color('r')}`
    return out
  }
)

const metaFormat = winston.format.printf(
  ({ level, message, label, timestamp, ...metadata }) => {
    let out = `[${timestamp}]`
    if (metadata.src !== undefined) {
      const pathArray = metadata.src.split('/')
      out += `[${pathArray[pathArray.length - 2]}][${
        pathArray[pathArray.length - 1]
      }]`
    }
    out += `${levelString(level)} ${message}}`
    return out
  }
)

const log = winston.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD][HH:mm:ss' }),
        metaFormatColor
      ),
    }),
    new winston.transports.File({
      filename: config.log.file,
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD][HH:mm:ss' }),
        metaFormat
      ),
    }),
  ],
})

export default log
