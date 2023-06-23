import Banned from '../models/ban.mjs'
import logger from '../config/logger.mjs'

const log = logger.child({ src: import.meta.url })

const banip = async (ip, reason, request) => {
  const ban = new Banned({ ip, reason, request })
  ban.save()
  log.warn(`New ban ${ip} ${reason} ${request}`)
}

export default banip
