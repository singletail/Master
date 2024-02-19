import express from 'express'
import logger from '../../config/logger.mjs'

//const log = logger.child({ src: import.meta.url })
const router = express.Router()

router.get('/', (req, res) => {
  const jsonres = {
    status: '/api/post get ok',
    // userdata: req.userdata,
  }
  res.json(jsonres)
})

export default router