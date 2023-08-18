import logger from '../../config/logger.mjs'
import auth from '../auth/auth.js'
import emailauth from '../auth/email.js'
import wsOut from './out.js'
import { color } from '../../config/colors.mjs'
const log = logger.child({ src: import.meta.url })
const sep = String.fromCharCode(133)

const wsIn = {
    msg: (id, msg) => {
        const msgStr = msg.toString()
        const msgArr = msgStr.split(sep)
        const type = msgArr[0]
        const topic = msgArr[1]
        const action = msgArr[2]
        const data = wsIn.parseData(msgArr[3])
        let logData = msgArr[3]
        if (action !== 'ping' && action !== 'pong')
            if (logData && logData.length > 10) {
                logData = logData.slice(0, 10)
                logData += '...'
            }
        log.info(` ${color('green')}[${type}:${topic}:${action}:${logData}]`)
        wsIn[type][topic][action](id, data)
    },

    parseData: (data) => {
        if (data && data.length > 0 && data.charAt(0) === '{')
            data = JSON.parse(data)
        return data
    },

    req: {
        auth: {
            email: async (id, data) => {
                const returnData = await emailauth.send(id, data)
                wsOut.sendVals(id, 'res', 'auth', 'email', returnData)
            },
            magic: async (id, data) => {
                const returnData = await emailauth.verify(
                    data.email,
                    data.token
                )
                wsOut.sendVals(id, 'res', 'auth', 'magic', returnData)
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
            authToken: (id, data) => {
                if (data === 'null' || data === null) {
                    wsOut.sendVals(id, 'req', 'auth', 'userToken', null)
                } else {
                    auth.checkAuthToken(id, data)
                }
            },
            userToken: (id, data) => {
                if (data === 'null' || data === null) return null
                auth.checkUserToken(id, data)
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
