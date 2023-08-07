import User from '../../models/user.mjs'
import * as jwt from '../../modules/jwt.mjs'

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

    userInfoData: (user) =>  {
        if (!user) return null
        const userData = {
            status: 'success',
            uuid: user.uuid,
            email: user.email,
            level: user.level,
            username: user.username,
            displayName: user.displayName,
        }
        return userData
    },
}

export default userauth