import logger from '../../config/logger.mjs'
import sock from './sock.js'
import session from '../session.js'
import { color } from '../../config/colors.mjs'
const log = logger.child({ src: import.meta.url })
const sep = String.fromCharCode(133)

const wsOut = {
    sendVals: (id, type, topic, action, data) => {
        const outArr = wsOut.packVals(type, topic, action, data)
        const s = session.ws[id]
        if (action !== 'ping' && action !== 'pong')
            log.info(
                `${color('blue')}[${outArr[1]}]=>${color('violet')}[${s.ip}]`
            )
        sock.send(id, outArr[0])
    },

    sendArr: (id, msgArr) => {
        const outArr = wsOut.packArr(msgArr)
        const s = session.ws[id]
        if (msgArr[2] !== 'ping' && msgArr[2] !== 'pong')
            log.info(
                `${color('blue')}[${outArr[1]}]=>${color('violet')}[${s.ip}]`
            )
        sock.send(id, outArr[0])
    },

    packVals: (type, topic, action, data) => {
        if (typeof data === 'object') data = JSON.stringify(data)
        const msg = `${type}${sep}${topic}${sep}${action}${sep}${data}`
        let logData = data
        if (logData && logData.length > 10) {
            logData = logData.slice(0, 10)
            logData += '...'
        }
        const debug = `${type}:${topic}:${action}:${logData}`
        return [msg, debug]
    },

    packArr: (cmdArr) => {
        let data = cmdArr[3]
        if (data && typeof data === 'object') data = JSON.stringify(data)
        const msg = `${cmdArr[0]}${sep}${cmdArr[1]}${sep}${cmdArr[2]}${sep}${data}`
        let logData = data
        if (logData && logData.length > 10) {
            logData = logData.slice(0, 10)
            logData += '...'
        }
        const debug = `${cmdArr[0]}:${cmdArr[1]}:${cmdArr[2]}:${logData}`
        return [msg, debug]
    },

    req: {
        auth: {
            identify: (id) => {
                wsOut.sendVals(id, 'req', 'auth', 'identify', null)
            },
            authToken: (id) => {
                wsOut.sendVals(id, 'req', 'auth', 'authToken', null)
            },
            userToken: (id) => {
                wsOut.sendVals(id, 'req', 'auth', 'userToken', null)
            },
        },
        sys: {
            ping: (id) => {
                wsOut.sendVals(id, 'req', 'sys', 'ping', null)
            },
        },
    },
    res: {
        auth: {
            authToken: (id, data) => {
                wsOut.sendVals(id, 'res', 'auth', 'authToken', data)
            },
            userToken: (id, data) => {
                wsOut.sendVals(id, 'res', 'auth', 'userToken', data)
            },
            login: (id, data) => {
                wsOut.sendVals(id, 'res', 'auth', 'login', data)
            },
            fail: (id) => {
                wsOut.sendVals(id, 'res', 'auth', 'fail', null)
            },
        },
    },
}

export default wsOut
