import logger from '../../config/logger.mjs'
import User from '../../models/user.mjs'
import * as jwt from '../../modules/jwt.mjs'
const log = logger.child({ src: import.meta.url })

const userauth = {
    verify: async (token) => {
        let resData = await userauth.checkToken(token)
        if (!resData) resData = { status: 'fail' }
        return resData
    },

    checkToken: async (token) => {
        const payload = await jwt.checkAndVerifyToken(token)
        if (!payload) return null
        const user = await User.findOne({ uuid: payload.sub })
        if (!user) return null
        user.last = Date.now()
        await user.save()
        const userData = userauth.userInfoData(user)
        return userData
    },

    userInfoData: (user) => {
        if (!user) return null
        const userData = {
            status: 'success',
            id: user.uuid,
            email: user.email,
            level: user.level,
            name: user.username,
            displayName: user.displayName,
        }
        return userData
    },
}

export default userauth
