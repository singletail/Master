import jwt from '../modules/jwt.mjs'
import User from '../models/user.mjs'

const authenticate = async (req, res, next) => {
  if (req.cookies.user) {
    const userUuid = await jwt.verifyJWT(req.cookies.user)
    if (userUuid) {
      const authUser = await User.findOne({ uuid: userUuid })
      if (authUser) {
        req.user = authUser
      }
    }
  }
  next()
}

export default authenticate
