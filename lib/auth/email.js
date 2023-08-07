import Magic from '../../models/magic.mjs'
import User from '../../models/user.mjs'
import * as jwt from '../../modules/jwt.mjs'
import { sendLink } from '../../modules/smtp.mjs'
import sock from '../ws/sock.js'

const emailauth = {

    send: async (id, email) => {
        const token = await emailauth.getTokenFor(email)
        const emailstatus = await sendLink(email, `https://n0.tel/auth?email=${email}&token=${token}`)
        let ok = 'fail'
        if (emailstatus === email) ok = 'sent'
        return ok
    },

    getTokenFor: async (email) => {
        const magicRecord = await emailauth.getMagicRecord(email)
        magicRecord.token = await jwt.jwtSign(magicRecord.uuid, 'auth', 'https://n0.tel')
        await magicRecord.save()
        return magicRecord.token
    },

    getMagicRecord: async (email) => {
        let magicRecord = await Magic.findOne({ email: email })
        if (!magicRecord) magicRecord = await new Magic({ email: email })
        return magicRecord
    },

    verify: async (id, email, token) => {
        let resData = await emailauth.checkToken(email, token)
        if (!resData) resData = { status: 'fail' }
        sock.sendVals(id, 'res', 'auth', 'email', resData)
    },

    checkToken: async (email, token) => {
        const tokenEmail = await jwt.checkAndVerifyToken(token)
        if (!tokenEmail || tokenEmail !== email) return null
        const user = emailauth.userFromVerifiedInfo(tokenEmail, token)
        if (!user) return null
        const userData = await emailauth.userInfoData(user)
        return userData
    },

    emailFromToken: async (token) => {
        const payload = await jwt.checkAndVerifyToken(token)
        let email
        if (payload) email = payload.sub
        return email
    },

    userFromVerifiedInfo: async (email, token) => {
        const record = await Magic.findOne({ email: email, token: token })
        if (!record) return null
        let user = await User.findOne({ uuid: record.userid })
        if (!user) user = await emailauth.createUser(record)
        return user
    },

    createUser: async (magicRecord) => {
        const userRecord = await new User({
            username: magicRecord.email,
            email: magicRecord.email,
            displayName: magicRecord.email,
        })
        userRecord.authentication.push('magicRecord.uuid')
        if (userRecord.level == 0) userRecord.level = 1
        userRecord.isAuthenticated = true
        await userRecord.save()
        magicRecord.userid = userRecord.uuid
        await magicRecord.save()
        return userRecord
    },

    userInfoData: async (user) =>  {
        if (!user) return null
        const userToken = await jwt.jwtSign(user.uuid, 'user')
        const authToken = await jwt.jwtSign(user.uuid, 'auth')
        const userData = {
            status: 'success',
            uuid: user.uuid,
            email: user.email,
            level: user.level,
            username: user.username,
            displayName: user.displayName,
            userToken: userToken,
            authToken: authToken,
        }
        return userData
    },
}

export default emailauth