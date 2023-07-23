import * as jwt from '../modules/jwt.mjs'
import cookieSettings from '../modules/cookies.mjs'
import User from '../models/user.mjs'
import logger from '../config/logger.mjs'

const log = logger.child({ src: import.meta.url })

const authenticate = async (req, res, next) => {
  let authUuid, userUuid, user, err
  if (req.cookies.auth) {
    let authPayload = await jwt.checkAndVerifyToken(req.cookies.auth)
    authUuid = authPayload.sub
  }
  if (!authUuid) {
    if (req.cookies.user) {
      let userPayload = await jwt.checkAndVerifyToken(req.cookies.user)
      userUuid = userPayload.sub
    }
  }
  if (authUuid) user = await User.findOne({ uuid: authUuid })
  if (!user && userUuid) user = await User.findOne({ uuid: userUuid })
  if (user) {
    if (user.isBanned || user.isLocked) {
      user = null
      err = { code: 401, message: 'User is banned or locked' }
    }
  }
  if (user) {
    if (!authUuid) {
      const newAuthToken = await jwt.jwtSign(
        userUuid,
        'auth',
        req.headers.origin
      )
      const options = cookieSettings('auth')
      res.cookie('auth', newAuthToken, options)
    }
    req.user = user
  }
  next()
}

export default authenticate
