const log = require('../config/logger.js');
const jwt = require('../modules/jwt');
const User = require('../models/user.js');

let debug = true;

const authenticate = async (req, res, next) => {
  var user_uuid;
  let user_name = 'Guest';
  let user_status = 'Not Signed In';
  if (req.cookies.user) {
    user_uuid = await jwt.verifyJWT(req.cookies.user);
    if (user_uuid) {
      let authUser = await User.findOne({ uuid: user_uuid });
      if (authUser) {
        req.User = authUser;
        user_name = authUser.displayName;
        user_status = 'Registered';
        if (authUser.isApproved) {
          user_status = 'Member';
        }
        if (authUser.isAdmin) {
          user_status = 'Administrator';
        }
        if (authUser.isBanned) {
          user_status = 'Banned';
        }
        if (debug) {
          log.info(`User ${user_name} verified, status: ${user_status}`);
        }
      }
    }
  } else {
    if (debug) {
      log.info(`No user cookies.`);
    }
  }
  req.user_name = user_name;
  req.user_status = user_status;
  next();
};

module.exports = authenticate;
