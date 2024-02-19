import logger from '../config/logger.mjs'
import map from './map.js'

const log = logger.child({ src: import.meta.url })
const proto = {
    status: 500,
}

const wssRouter = {
    all: (id, type, topic, action, data) => {
        const cmd = { ...proto }
        cmd.method = type
        cmd.topic = topic
        cmd.action = action
        cmd.body = data
  
        //maybe:
        //cmd.session = req.session
        //cmd.cookies = req.cookies
        //cmd.hostname = req.hostname
  
        if (!map[cmd.method][cmd.topic]) {
            cmd.status = 404
            cmd.result = 'Not Found'
        } else {
            cmd.status = 200
            cmd.result = map[cmd.method][cmd.topic][cmd.action]
        }
  
        //log.info(`interface/api/${cmd.type}/${cmd.topic}/${cmd.action} from ${req.ip}`)
        log.info(`cmd: ${JSON.stringify(cmd)}`)
        res.status(cmd.status).json({ result: cmd.result })

        //response is something like:
        wsOut.sendVals(id, 'req', 'auth', 'userToken', null)
    }
}

export default wssRouter
