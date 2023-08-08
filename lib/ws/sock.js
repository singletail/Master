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
        session.wsDestroy(id)
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

}

export default sock