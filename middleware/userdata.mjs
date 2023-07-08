const userdata = async (req, res, next) => {
  if (req.user) {
    req.userdata.username = req.user.username
    req.userdata.displayName = req.user.displayName || req.user.username || 'Unknown User'
    req.userdata.level = req.user.level
    req.userdata.isAdmin = req.user.isAdmin
    req.userdata.isAuthenticated = true
  }
  next()
}

export default userdata