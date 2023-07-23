import cookieSettings from '../modules/cookies.mjs'
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

    const options = cookieSettings('auth')
    res.cookie('data', req.userdata, options)
  }
  next()
}

export default userdata
