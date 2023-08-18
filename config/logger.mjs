import * as winston from 'winston'
import config from './config.mjs'
import g from './glyphs.mjs'
import { color, bgcolor } from './colors.mjs'

const levelStringColor = (level) => {
    //const str = level.toUpperCase()
    switch (level) {
        case 'emerg':
            return `${bgcolor('red')}[${g(level)}]${color('r')}`
        case 'alert':
            return `${bgcolor('orange')}[${g(level)}]${color('r')}`
        case 'crit':
            return `${bgcolor('yellow')}[${g(level)}]${color('r')}`
        case 'error':
            return `${color('red')}[${g(level)}]${color('r')}`
        case 'warn':
            return `${color('orange')}[${g(level)}]${color('r')}`
        case 'notice':
            return `${color('cyan')}[${g(level)}]${color('r')}`
        case 'info':
            return `${color('green')}[i]${color('r')}`
        case 'debug':
            return `${color('violet')}[${g(level)}]${color('r')}`
        default:
            return `${color('blue')}[${g(level)}]${color('r')}`
    }
}

const levelString = (level) => `[${level.toUpperCase()}]`

const metaFormatColor = winston.format.printf(
    ({ level, message, label, timestamp, ...metadata }) => {
        let out = `${color('red')}[${timestamp}]`

        if (metadata.src !== undefined) {
            const pathArray = metadata.src.split('/')
            const path = pathArray[pathArray.length - 2]
            const fileName = pathArray[pathArray.length - 1]
            const file = fileName.split('.')[0]

            out += `${color('orange')}[${path}]`
            if (file !== path && file !== 'index')
                out += `${color('yellow')}[${file}]`
        }
        out += `${levelStringColor(level)}${message}${color('r')}`
        return out
    }
)

const metaFormat = winston.format.printf(
    ({ level, message, label, timestamp, ...metadata }) => {
        let out = `[${timestamp}]`
        if (metadata.src !== undefined) {
            const pathArray = metadata.src.split('/')
            const path = pathArray[pathArray.length - 2]
            const fileName = pathArray[pathArray.length - 1]
            const file = fileName.split('.')[0]
            out += `[${path}]`
            if (file !== path && file !== 'index') out += `[${file}]`
        }
        out += `${levelString(level)}${message}}`
        return out
    }
)

const log = winston.createLogger({
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                //winston.format.timestamp({ format: 'YYYY-MM-DD][HH:mm:ss' }),
                winston.format.timestamp({ format: 'HH:mm:ss' }),
                metaFormatColor
            ),
        }),
        new winston.transports.File({
            filename: config.log.file,
            format: winston.format.combine(
                //winston.format.timestamp({ format: 'YYYY-MM-DD][HH:mm:ss' }),
                winston.format.timestamp({ format: 'HH:mm:ss' }),
                metaFormat
            ),
        }),
    ],
})

export default log
