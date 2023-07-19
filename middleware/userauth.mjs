import * as jwt from '../modules/jwt.mjs'
import * as x from '../modules/util.mjs'
import User from '../models/user.mjs'
import logger from '../config/logger.mjs'

const log = logger.child({ src: import.meta.url })


const authenticate = async (req, res, next) => {
  let uuid, user, err, stale
  let username = 'none'
  if (req.cookies.auth) {
    const authToken = await jwt.verify(req.cookies.auth)
    if (authToken.sub) {
       uuid = authToken.sub
    }
  }
  if (!uuid) {
    stale = true
    if (req.cookies.user) {
      const userToken = await jwt.verify(req.cookies.user)
      if (userToken.sub) {
        uuid = userToken.sub
      }
    }
  }
  if (uuid) {
    user = await User.findOne({ uuid: uuid })
  }
  if (user) {
    username = user.username
    if (user.isBanned || user.isLocked) {
      user = null
      err = {code: 401, message: 'User is banned or locked'}
    }
  }
  if (user) {
    if (stale) {
      const newAuthToken = await jwt.create('auth', user.uuid )
      const exp = await x.cookieExpByType('auth')
      res.cookie('auth', newAuthToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
        expires: exp,
      })
    }
    req.user = user
  }
  //log.info(`userauth done ${username}`)
  next()
}

export default authenticate
