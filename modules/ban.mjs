import Banned from '../models/ban.mjs'
import log from '../config/logger.mjs'
// import * as logger from '../config/logger.mjs'

// const log = logger(module)

const banip = async (ip, reason, request) => {
  const ban = new Banned({ ip, reason, request })
  ban.save()
  log.warn(`New ban ${ip} ${reason} ${request}`)
}

export default banip
