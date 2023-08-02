
import logger from '../config/logger.mjs'
import { email } from '../modules/auth/email.mjs'
import sock from '../lib/ws/sock.js'
const log = logger.child({ src: import.meta.url })

const sep = String.fromCharCode(133)

const expo = {

    msg: (id, msg) => {
        log.info(`msg() id: ${id} msg: ${msg}`)
        const msgStr = msg.toString()
        log.info(`msg() id: ${id} msg: ${msgStr}`)
        const cmdArr = msgStr.split(sep)
        switch (cmdArr[0]) {
            case 'req':
                expo.req(id, cmdArr)
                break
            default:
                log.error(`msg() id: ${id} unknown command: ${cmdArr[0]}`)  
        }
    },

    cmd: (id, cmdArr) => {
        switch (cmdArr[0]) {
            case 'res':
                expo.res(id, cmdArr)
                break
            default:
                log.error(`cmd() id: ${id} unknown command: ${cmdArr[0]}`)
        }
    },

    req: (id, cmdArr) => {
        switch (cmdArr[1]) {
            case 'auth':
                expo.auth(id, cmdArr)
                break
            default:
                log.error(`req() id: ${id} unknown command: ${cmdArr[1]}`)
        }
    },

    auth: (id, cmdArr) => {
        switch (cmdArr[2]) {
            case 'email':
                email(id, cmdArr[3])
                break
            default:
                log.error(`auth() id: ${id} unknown command: ${cmdArr[2]}`)
        }
    },

    res: (id, cmdArr) => {
        let msg = ''
        for (let i = 0; i < cmdArr.length; i++) {
            msg += cmdArr[i]
            msg += sep
        }
        sock.send(id, msg)
    },
            
                
}

export default expo