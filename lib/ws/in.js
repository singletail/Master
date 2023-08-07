import logger from '../../config/logger.mjs'
import emailauth from '../auth/email.js'
import userauth from '../auth/user.js'
import wsOut from './out.js'
const log = logger.child({ src: import.meta.url })
const sep = String.fromCharCode(133)

const wsIn = {

    msg: (id, msg) => {
        const msgStr = msg.toString()
        log.info(`ws/in msgSr: ${msgStr}`)
        const msgArr = msgStr.split(sep)
        const type = msgArr[0]
        const topic = msgArr[1]
        const action = msgArr[2]
        const data = wsIn.parseData(msgArr[3])
        log.info(`[wsIn] ${type} ${topic} ${action} ${data}`)
        wsIn[type][topic][action](id, data)
    },

    parseData: (data) => {
        if (data && data.length > 0 && data.charAt(0) === '{') data = JSON.parse(data)
        return data
    },

    req: {
        auth: {
            email: async (id, data) => {
                const returnData = await emailauth.send(id, data)
                wsOut.sendVals(id, 'res', 'auth', 'email', returnData)
            },
            token: async (id, data) => {
                const returnData = await emailauth.verify(data.email, data.token)
                wsOut.sendVals(id, 'res', 'auth', 'token', returnData)
            },
        },
        sys: {
            ping: (id) => {
                wsOut.sendVals(id, 'res', 'sys', 'pong', null)
            },
        },
    },

    res: {
        auth: {
            identify: async (id, data) => {
                const returnData = await userauth.verify(data)
                wsOut.sendVals(id, 'res', 'auth', 'identify', returnData)
            },
        },
        sys: {
            pong: (id) => {
                // TODO: keep track of connection trip time
            },
        },
    },
}

export default wsIn