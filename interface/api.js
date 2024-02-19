import express from 'express'
import logger from '../config/logger.mjs'
import map from './map.js'

const log = logger.child({ src: import.meta.url })
const router = express.Router()

const proto = {
    status: 500,
}

router.all('/:topic/:action', (req, res) => {
    const cmd = { ...proto }
    cmd.method = req.method
    cmd.topic = req.params.topic
    cmd.action = req.params.action
    cmd.body = req.body
  
    //maybe:
    cmd.session = req.session
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
})

export default router
