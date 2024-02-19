import express from 'express'
import ban from '../lib/ban.js'

const router = express.Router()

router.all('/wordpress/*', async (req, res, next) => {
    const reason = req.url
    await ban.add(req.ip, req.url, reason)
    const err = new Error('Banned.')
    err.status = 401
    next(err)
})

router.all('/wp-*', async (req, res, next) => {
    const reason = req.url
    await ban.add(req.ip, req.url, reason)
    const err = new Error('Banned.')
    err.status = 401
    next(err)
})

router.all('/wp/*', async (req, res, next) => {
    const reason = req.url
    await ban.add(req.ip, req.url, reason)
    const err = new Error('Banned.')
    err.status = 401
    next(err)
})

router.all('/*.php', async (req, res, next) => {
    const reason = req.url
    await ban.add(req.ip, req.url, reason)
    const err = new Error('Banned.')
    err.status = 401
    next(err)
})

router.all('/*.php7', async (req, res, next) => {
    const reason = req.url
    await ban.add(req.ip, req.url, reason)
    const err = new Error('Banned.')
    err.status = 401
    next(err)
})

router.all('*uploadify*', async (req, res, next) => {
    const reason = req.url
    await ban.add(req.ip, req.url, reason)
    const err = new Error('Banned.')
    err.status = 401
    next(err)
})

router.all('*cpanel*', async (req, res, next) => {
    const reason = req.url
    await ban.add(req.ip, req.url, reason)
    const err = new Error('Banned.')
    err.status = 401
    next(err)
})

router.all('*code_signing*', async (req, res, next) => {
    const reason = req.url
    await ban.add(req.ip, req.url, reason)
    const err = new Error('Banned.')
    err.status = 401
    next(err)
})

export default router
