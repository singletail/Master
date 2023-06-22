import express from 'express'
import banip from '../modules/ban.mjs'

const router = express.Router()

router.get('/wp-*', async (req, res, next) => {
  const reason = req.url
  banip(req.ip, req.url, reason)
  const err = new Error('Banned.')
  err.status = 401
  next(err)
})

router.get('/*.php', async (req, res, next) => {
  const reason = req.url
  banip(req.ip, req.url, reason)
  const err = new Error('Banned.')
  err.status = 401
  next(err)
})

router.get('/*.php7', async (req, res, next) => {
  const reason = req.url
  banip(req.ip, req.url, reason)
  const err = new Error('Banned.')
  err.status = 401
  next(err)
})

export default router
