import utils from './utils.js'
import Banned from '../models/ban.mjs'
import logger from '../config/logger.mjs'

const log = logger.child({ src: import.meta.url })


const ban = {

  cache: [],

  req: async (req, res, next) => {
    let err
    if (ban.check(req.ip)) {
      err = new Error('Banned')
      err.status = 401
      await ban.increment(req.ip)
      log.warn(`Banned IP: ${req.ip}`)
    }
    next(err)
  },

  refresh: async () => {
    ban.cache = []
    const bans = await Banned.find()
    bans.forEach((banned) => {
      if (!utils.inArr(ban.cache, banned.ip)) ban.cache.push(banned.ip)
    })
    log.info(`Bans Refreshed: ${ban.cache.length}`)
    return true
  },

  check: (ip) => {
    if (utils.inArr(ban.cache, ip)) {
      return true
    } else {
      return false
    }
  },

  add: async (ip, reason, request) => {
    const banned = await new Banned({ ip, reason, request })
    await banned.save()
    ban.cache.push(ip)
    log.warn(`New Ban: ${ip} ${reason} ${request}`)
  },

  increment: async (ip) => {
    const banned = await Banned.findOne({ ip })
    banned.$inc('attempts', 1)
    banned.last = Date.now()
    await banned.save()
  },

  list: () => {
    return ban.cache
  },

  init: async () => {
    await ban.refresh()
    return ban.cache
  }

}

export default ban
