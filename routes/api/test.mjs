import express from 'express'
import logger from '../../config/logger.mjs'

const log = logger.child({ src: import.meta.url })
const router = express.Router()


const payload = {
  proto: 'api',
  type: 'req',
  topic: 'test',
  action: null,
  code: null,
  data: null,
  id: null,
}

router.get('/', (req, res) => {
  const jsonres = {
    status: '/api/test get ok',
    userdata: req.userdata,
  }
  res.json(jsonres)
})

router.get('/ping', (req, res) => {
  const order = { ...payload }
  order.action = 'ping'
  order.id = req.session.id


  const jsonres = {
    status: '/api/test get ok',
    userdata: req.userdata,
  }
  res.json(jsonres)
})


router.post('/',  (req, res) => {
  log.info(`reached /api/test from ${req.ip}`)
  log.info(`req.body: ${JSON.stringify(req.body)}`)

  const jsonres = {
    status: 'post ok',
    //geo: req.userdata.geo,
    //tracker: req.tracker,
  }
  res.json(jsonres)
})



router.get('/wc(/*)?', (req, res) => {
  log.info(`reached /api/wc from ${req.ip}`)
  res.json({ status: 'wc' })
})

router.get('/:id/:xd', (req, res) => {
  log.info(`reached /api/wc from ${req.params.ip}`)
  res.json({ id: req.params.id, xd: req.params.xd  })
})

export default router
