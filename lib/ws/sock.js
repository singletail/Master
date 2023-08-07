import session from '../session.js'
import logger from '../../config/logger.mjs'
import wsIn from './in.js'
import wsOut from './out.js'
const log = logger.child({ src: import.meta.url })

const sock = {

    new: (id, socket, request) => {
        log.info('new() id: ' + id)
        const s = session.wsNew(id, socket, request)
        wsOut.req.auth.identify(id)
        log.info(`new() id: ${s.id} ip: ${s.ip} name: ${s.displayName}`)
    },

    message: (id, message) => {
        const s = session.ws[id]
        log.info(`[Incoming ws message]: '${message}' from ${s.ip} / ${id} (${session.wsCount()} open sockets)`)
        wsIn.msg(id, message)
    },

    error: (id, error) => {
        const s = session.ws[id]
        log.error(`id: ${id} error: (${JSON.stringify(error)} name: ${s.displayName}`)
        sock.close(id)
    },

    close: (id) => {
        log.info(`close() id: ${id}`)
        session.wsDestroy(id)
    },

    send: (id, message) => {
        const s = session.ws[id]
        log.info(`send() id: ${id} s.ip: ${s.ip} message: ${message}`)
        s.socket.send(message)
    },

    broadcast: (message) => {
        for (const [key] of Object.entries(session.ws)) sock.send(key, message)
    },

    /*
    sendVals: (id, type, topic, action, data) => {
        const msg = sock.packVals(type, topic, action, data)
        log.info(`sendVals returning ${JSON.stringify(msg)}`)
        sock.send(id, msg)
    },

    sendArr: (id, msgArr) => {
        const msg = sock.packArr(msgArr)
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
    */
    
}

export default sock