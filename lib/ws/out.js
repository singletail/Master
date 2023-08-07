import logger from '../../config/logger.mjs'
import sock from './sock.js'
const log = logger.child({ src: import.meta.url })
const sep = String.fromCharCode(133)

const wsOut = {

    sendVals: (id, type, topic, action, data) => {
        const msg = wsOut.packVals(type, topic, action, data)
        log.info(`wsOut.sendVals returning ${JSON.stringify(msg)}`)
        sock.send(id, msg)
    },

    sendArr: (id, msgArr) => {
        const msg = wsOut.packArr(msgArr)
        sock.send(id, msg)
    },

    packVals: (type, topic, action, data) => {
        if (typeof data === 'object') data = JSON.stringify(data)
        return `${type}${sep}${topic}${sep}${action}${sep}${data}`
    },

    packArr: (cmdArr) => {
        let data = cmdArr[3]
        if (data && typeof data === 'object') data = JSON.stringify(data)
        return `${cmdArr[0]}${sep}${cmdArr[1]}${sep}${cmdArr[2]}${sep}${data}`
    },

    req: {
        auth: {
            identify: (id) => {
                wsOut.sendVals(id, 'req', 'auth', 'identify', null)
            },
        },
        sys: {
            ping: (id) => {
                wsOut.sendVals(id, 'req', 'sys', 'ping', null)
            },
        },
    },
}

export default wsOut