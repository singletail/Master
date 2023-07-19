import Banned from '../models/ban.mjs'
import logger from '../config/logger.mjs'

const log = logger.child({ src: import.meta.url })

const blacklist = async (req, res, next) => {
  const ban = await Banned.findOne({ ip: req.ip })
  if (ban) {
    log.warn(`Banned IP: ${req.ip}`)
    req.userdata.isBanned = true
    ban.$inc('attempts', 1)
    ban.last = Date.now()
    ban.save()
    const err = new Error('Banned')
    err.status = 401
    next(err)
  } else {
    //log.info(`ban check done ${req.ip}`)
    next()
  }
}

export default blacklist
