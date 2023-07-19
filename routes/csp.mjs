import express from 'express'
import bodyParser from 'body-parser'
import { color } from '../config/colors.mjs'
import logger from '../config/logger.mjs'

const log = logger.child({ src: import.meta.url })
const router = express.Router()
const cspParser = bodyParser.json({ type: 'application/csp-report' })

router.post('/csp-report', cspParser, async (req, res, next) => {
//router.post('/csp-report', async (req, res, next) => {
    log.warn(`${color('violet')}req.body: ${JSON.stringify(req.body)}`)
    //let csp = ''
    //if (body['csp-report']) {
    //  csp = body['csp-report']
    //}
    //log.warn(JSON.stringify(csp))
    res.status(200).json({ message: 'csp-report received' })
})


export default router
