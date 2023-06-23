import express from 'express'
import logger from '../config/logger.mjs'

const log = logger.child({ src: import.meta.url })
const router = express.Router()

/*
router.get('/', async (req, res) => {
  let data = {
    title: 'O',
    msg: 'Hai',
    //  geo: req.geo,
    //  localTime: req.localTime,
  };
  res.render('index', { data });
  res.end();
});
*/

router.get('/', async (req, res) => {
  const data = {
    title: 'O',
    msg: 'Hai',
  }
  res.render('index', { data, user: req.userData })
})

router.get('/temp', async (req, res, next) => {
  log.info(`reached temp from ${req.ip}`)
  res.send('Server is running')
  next()
})

export default router
