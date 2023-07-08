import User from '../models/user.mjs'
import Tracker from '../models/tracker.mjs'
import banip from '../modules/ban.mjs'
import * as hash from '../modules/hash.mjs'
import logger from '../config/logger.mjs'

const log = logger.child({ src: import.meta.url })

export const findByUuid = async (uuid) => {
    const user = await User.findOne({ uuid: uuid })
    return user
}

export const findByUsername = async (username) => {
  const user = await User.findOne({ username: username })
  return user
}

export const create = async (uuid) => {
    const user = await new User({ uuid: uuid })
    await user.save()
    return user
}

export const createWithPassword = async (username, password, trackerUuid) => {
    const pwHash = await hash.create(password)
    const user = await new User({
      username: username,
      displayName: username,
      hash: pwHash,
    })
    user.trackers.push(trackerUuid)
    await user.save()
    return user
}

export const loginUserPassword = async (username, password, ip, trackerUuid) => {
  let err, ok
  let tracker = await Tracker.findOne({ uuid: trackerUuid })
  let user = await User.findOne({ username: username })

  if (!user) {
    log.warn(`invalid username ${username} from ${ip}`)
    if (tracker) { 
      log.info(`tracker ${tracker.uuid} found, adding error`)
      tracker.numErrors += 1 
      if (tracker.numErrors >= 3) {
        banip(ip, `Too many failed login usernames`, `user: ${username}`)
        tracker.isBanned = true
      }
    } else {
      log.info(`tracker ${tracker.uuid} NOT found`)
    }
  } else {
    ok = await hash.check(password, user.hash)
    if (!ok) {
      log.warn(`invalid password for user ${username} from ${ip}`)
      user.numFails += 1
      if (user.numFails >= 3) {
        banip(ip, `Too many failed login attempts`, `user: ${username}`)
        user.isLocked = true
        if (tracker) { tracker.isBanned = true }
      }
      user = null
    } else {
      user.numFails = 0
      tracker.numErrors = 0
      tracker.numRequests += 1
      tracker.last = Date.now()
    }
    await user.save()
  }
  await tracker.save()
  return user
}

