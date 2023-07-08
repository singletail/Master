const initUserdata = async (req, res, next) => {
  req.userdata = {
    ip: req.ip,
    username: '',
    displayName: '',
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
  next()
}

export default initUserdata
