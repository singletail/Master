import session from '../session.js'
import logger from '../../config/logger.mjs'
import expo from '../expo.js'
const log = logger.child({ src: import.meta.url })

const sock = {

    new: (id, socket, request) => {
        log.info('new() id: ' + id)
        const s = session.wsNew(id, socket, request)
        log.info(`new() id: ${s.id} ip: ${s.ip} name: ${s.displayName}`)
    },

    message: (id, message) => {
        const s = session.ws[id]
        log.info(`message() id: ${id} s.ip: ${s.ip} message: ${message} numSockets: ${session.wsCount()}`)
        expo.msg(id, message)
    },

    error: (id, error) => {
        const s = session.ws[id]
        log.error(`id: ${id} error: (${JSON.stringify(error)} name: ${s.displayName}`)
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
    
}

export default sock