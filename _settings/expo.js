
import logger from '../config/logger.mjs'
import { email } from '../modules/auth/email.mjs'
import sock from '../lib/ws/sock.js'
const log = logger.child({ src: import.meta.url })

const sep = String.fromCharCode(133)

const packArr = (cmdArr) => {
    let msg = ''
    for (let i = 0; i < cmdArr.length; i++) {
        msg += cmdArr[i]
        if (i < cmdArr.length - 1) {
            msg += sep 
        }
    }
    return msg
}

const expo = {

    msg: (id, msg) => { // incoming
        log.info(`expo/msg(): (msg): ${msg} from ${id}`)
        const msgStr = msg.toString()
        log.info(`expo/msg(): (msg.toString): ${msgStr} from ${id}`)
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
        log.info(`expo.req() stringified array: ${JSON.stringify(cmdArr)}`)
        switch (cmdArr[1]) {
            case 'auth':
                expo.auth(id, cmdArr)
                break
        case 'sys':
                expo.sys(id, cmdArr)
                break
            default:
                log.error(`req() id: ${id} unknown command: ${cmdArr[1]}`)
        }
    },

    auth: (id, cmdArr) => {
        log.info(`expo.auth() stringified array: ${JSON.stringify(cmdArr)}`)
        switch (cmdArr[2]) {
            case 'email':
                email(id, cmdArr[3])
                break
            default:
                log.error(`auth() id: ${id} unknown command: ${cmdArr[2]}`)
        }
    },

    sys: (id, cmdArr) => {
        switch (cmdArr[2]) {
            case 'ping':
                log.info('got ping, sending pong.')
                sock.send(id, packArr(['res', 'sys', 'pong']))
                break
            default:
                log.error(`auth() id: ${id} unknown command: ${cmdArr[2]}`)
        }
    },

    res: (id, msg) => {
        let output
        typeof msg === 'object' ? output = packArr(msg) : output = msg
        sock.send(id, output)
    },
            
                
}

export default expo