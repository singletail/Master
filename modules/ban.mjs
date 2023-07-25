import Banned from '../models/ban.mjs'
import logger from '../config/logger.mjs'

const log = logger.child({ src: import.meta.url })

const cacheObj = {}
const cacheArr = []

export const refreshBanCache = async () => {
  const bans = await Banned.find()
  bans.forEach((ban) => {
    cacheObj[ban.ip] = ban
    cacheArr.push(ban.ip)
  })
  return cacheArr
}

export const banCheck = (ip) => {
  if (cacheArr.includes(ip)) {
    return true
  } else {
    return false
  }
}

export const banList = async () => {
  return cacheArr
}

export const banUpdate = async (ip) => {
  if (cacheArr.includes(ip)) {
    let banEntry = await Banned.findOne({ ip: ip })
    if (banEntry) {
      banEntry.count++
      banEntry.last = Date.now()
      await banEntry.save()
      log.info(`ban incremented ${ip}`)
    }
  }
}

const banip = async (ip, reason, request) => {
  const ban = await new Banned({ ip, reason, request })
  await ban.save()
  log.warn(`New ban ${ip} ${reason} ${request}`)
  await refreshBanCache()
}

export default banip
