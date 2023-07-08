import express from 'express'
import logger from '../../config/logger.mjs'

const log = logger.child({ src: import.meta.url })
const router = express.Router()

router.get('/', async (req, res) => {
  const jsonres = {
    status: 'get ok',
    userdata: req.userdata,
  }
  res.json(jsonres)
})

router.post('/', async (req, res) => {
  log.info(`reached /api/test from ${req.ip}`)
  log.info(`req.body: ${JSON.stringify(req.body)}`)
  const jsonres = {
    status: 'post ok',
    geo: req.userdata.geo,
    tracker: req.tracker,
  }
  res.json(jsonres)
})

export default router
