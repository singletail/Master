import Tracker from '../models/tracker.mjs'
import * as jwt from '../modules/jwt.mjs'
import cookieSettings from '../modules/cookies.mjs'
import logger from '../config/logger.mjs'

const log = logger.child({ src: import.meta.url })

const tracker = async (req, res, next) => {
  log.info('tracker()', req.cookies.tracker)
  log.info(
    `Tracker middleware: ${JSON.stringify(req.cookies)}, ${JSON.stringify(
      req.headers,
    )}}`,
  )
  let tracker, stale
  if (req.cookies.tracker) {
    const trackerPayload = await jwt.checkAndVerifyToken(
      req.cookies.tracker,
      req.headers.origin,
    )
    if (trackerPayload) {
      tracker = await Tracker.findOne({ uuid: trackerPayload.sub })
      if (tracker) tracker.numRequests += 1
    }
  }
  if (!tracker) {
    tracker = await new Tracker()
    stale = true
  }
  tracker.last = Date.now()
  tracker.ip.addToSet(req.ip)
  await tracker.save()
  if (stale) {
    const newTrackerToken = await jwt.jwtSign(
      tracker.uuid,
      'tracker',
      req.headers.origin
    )
    const options = cookieSettings('tracker')
    log.info(
      `Tracker setting cookie: ${newTrackerToken} with options ${JSON.stringify(
        options
      )}`
    )
    res.cookie('tracker', newTrackerToken, options)
  }
  next()
}

export default tracker
