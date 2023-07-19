import * as x from '../modules/util.mjs'
import logger from '../config/logger.mjs'

const log = logger.child({ src: import.meta.url })

const userdata = async (req, res, next) => {
  if (req.user) {
    req.userdata.username = req.user.username
    req.userdata.displayName =
      req.user.displayName || req.user.username || 'Unknown User'
    req.userdata.level = req.user.level
    req.userdata.isAdmin = req.user.isAdmin
    req.userdata.isAuthenticated = true

    const exp = await x.cookieExpByType('auth')
    res.cookie('data', req.userdata, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      expires: exp,
    })
  }
  //log.info(`userdata update done ${req.userdata.username}`)
  next()
}

export default userdata
