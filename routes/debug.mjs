import express from 'express'
import logger from '../config/logger.mjs'

const router = express.Router()
const log = logger.child({ src: import.meta.url })

router.get('/cert', async (req, res) => {
  log.debug(req)
  const data = {
    title: 'Cert',
    msg: req,
  }
  res.render('debug', { data, user: req.userData })
})

export default router
