const log = require('../config/logger.js')(module);
const jwt = require('../modules/jwt');
const Tracker = require('../models/tracker.js');

let debug = false;

const check = async (req, res, next) => {
  let tracker_uuid;
  if (req.cookies.tracker) {
    tracker_uuid = await jwt.verifyJWT(req.cookies.tracker);
    if (debug) {
      log.info(`+ verified tracker_uuid: ${tracker_uuid}`);
    }
    if (tracker_uuid) {
      req.tracker = await Tracker.findOne({ uuid: tracker_uuid });
      if (req.tracker) {
        req.tracker.$inc('num_requests', 1);
        if (debug) {
          log.info(`tracker ${tracker_uuid} verified.`);
        }
      }
    } else {
      log.warn('- tracker is empty');
    }
  }
  if (!tracker_uuid) {
    req.tracker = new Tracker();
    tracker_uuid = req.tracker.uuid;
    if (debug) {
      log.info(`New Tracker Cookie for ${req.real_ip} - ${tracker_uuid}`);
    }
    let unsignedJwt = await jwt.createJWT(tracker_uuid);
    let signedJwt = await jwt.signJWT(unsignedJwt);
    res.cookie('tracker', signedJwt, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 2592000000,
    });
  }
  req.tracker.ip.addToSet(req.ip);
  req.tracker.save();
  next();
};

module.exports = { check };
