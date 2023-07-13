import logger from '../config/logger.mjs'

const log = logger.child({ src: import.meta.url })

const initUserdata = async (req, res, next) => {
  req.userdata = {
    ip: req.ip,
    username: 'none',
    displayName: 'none',
    level: 0,
    isAdmin: false,
    isApproved: false,
    isAuthenticated: false,
    geo: {
      region: '',
      city: '',
      countryCode: '',
      footer: '',
      offset: 0,
    },
  }
  log.info(`init done ${req.userdata.username}`)
  next()
}

export default initUserdata
