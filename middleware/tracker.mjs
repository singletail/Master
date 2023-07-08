import Tracker from '../models/tracker.mjs'
import * as jwt from '../modules/jwt.mjs'
import * as x from '../modules/util.mjs'
import logger from '../config/logger.mjs'

const log = logger.child({ src: import.meta.url })

const maxAge = 86400000 // 24 hours

const tracker = async (req, res, next) => {
  let tracker, stale
  if (req.cookies.tracker) {
    const claims = await jwt.verify(req.cookies.tracker)
    if (claims) {
      if (claims.iat < x.now() - maxAge) {
        log.info(`Tracker token is stale ${claims.iat} ${x.now() - maxAge}`)
        stale = true
      }
      tracker = await Tracker.findOne({ uuid: claims.sub })
      if (tracker) {
        tracker.numRequests += 1
      }
    }
  }
  if (!tracker) {
      tracker = await new Tracker()
      stale = true
  }
  tracker.last = Date.now()
  tracker.ip.addToSet(req.ip)
  await tracker.save()
  req.tracker = tracker

  if (stale) {
    const trackerToken = await jwt.create('tracker', tracker.uuid )
    const exp = await x.cookieExpByType('tracker')
    res.cookie('tracker', trackerToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      expires: exp,
    })
  }
  next()
}

export default tracker
