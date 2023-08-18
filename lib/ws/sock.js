import session from '../session.js'
import logger from '../../config/logger.mjs'
import wsIn from './in.js'
import auth from '../auth/auth.js'
import { color } from '../../config/colors.mjs'
const log = logger.child({ src: import.meta.url })

const sock = {
    new: (id, socket, request) => {
        const s = session.wsNew(id, socket, request)
        log.info(`${color('pink')}[new][${s.ip}][${s.displayName}]`)
        auth.new(id) // request tokens from client
    },

    message: (id, msg) => {
        wsIn.msg(id, msg)
    },

    error: (id, error) => {
        const s = session.ws[id]
        log.error(`[err][${id}][${s.ip}][${s.displayName}][${error}]`)
        if (id) sock.close(id)
    },

    close: (id) => {
        const s = session.ws[id]
        log.info(`[close][${s.ip}][${id}][${s.displayName}]`)
        session.wsDestroy(id)
    },

    send: (id, msg) => {
        const s = session.ws[id]
        s.socket.send(msg)
    },

    broadcast: (msg) => {
        for (const [key] of Object.entries(session.ws)) sock.send(key, msg)
    },
}

export default sock
