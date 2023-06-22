import express from 'express'
import log from '../config/logger.mjs'
// import * as logger from '../config/logger.mjs'

const router = express.Router()

// const log = logger(module)

router.get('/cert', async (req, res) => {
  log.debug(req)
  const data = {
    title: 'Cert',
    msg: req,
  }
  res.render('debug', { data, user: req.userData })
})

export default router
