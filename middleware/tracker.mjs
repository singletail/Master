import jwt from '../modules/jwt.mjs'
import Tracker from '../models/tracker.mjs'

const tracker = async (req, res, next) => {
  let trackerUuid
  if (req.cookies.tracker) {
    trackerUuid = await jwt.verifyJWT(req.cookies.tracker)
    if (trackerUuid) {
      req.tracker = await Tracker.findOne({ uuid: trackerUuid })
      if (req.tracker) {
        req.tracker.$inc('num_requests', 1)
      }
    }
  }
  if (!trackerUuid) {
    req.tracker = new Tracker()
    trackerUuid = req.tracker.uuid
    const unsignedJwt = await jwt.createJWT(trackerUuid)
    const signedJwt = await jwt.signJWT(unsignedJwt)
    res.cookie('tracker', signedJwt, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 2592000000,
    })
  }
  req.tracker.ip.addToSet(req.ip)
  req.tracker.save()
  next()
}

export default tracker
