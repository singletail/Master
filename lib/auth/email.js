
import logger from '../../config/logger.mjs'
import Magic from '../../models/magic.mjs'
import User from '../../models/user.mjs'
import * as jwt from '../../modules/jwt.mjs'
import { sendLink } from '../../modules/smtp.mjs'
const log = logger.child({ src: import.meta.url })

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

    verify: async (email, token) => {
        let resData = await emailauth.checkToken(email, token)
        if (!resData) resData = { status: 'fail' }
        return resData
    },

    checkToken: async (email, token) => {
        const payload = await jwt.checkAndVerifyToken(token)
        if (!payload) return null
        log.info(`payload.sub: ${payload.sub}`)
        const record = await Magic.findOne({ email: email })
        if (!record) {
            log.warn('no magic record found for email ${email}')
            return null
        }
        log.info(`magic record: ${JSON.stringify(record)}`)
        let user = await User.findOne({ uuid: record.userid })

        //const user = await emailauth.userFromVerifiedInfo(email, payload.sub)
        if (!user) {
            log.warn(`user ${email} not found. creating.`)
            user = await emailauth.createUser(record)
        }
        const userData = await emailauth.userInfoData(user)
        return userData
    },

    emailFromToken: async (token) => {
        const payload = await jwt.checkAndVerifyToken(token)
        let email
        if (payload) email = payload.sub
        return email
    },

    createUser: async (magicRecord) => {
        const userRecord = await new User({
            username: magicRecord.email,
            email: magicRecord.email,
            displayName: magicRecord.email,
            level: 1,
        })
        userRecord.authentication.push('magicRecord.uuid')
        await userRecord.save()
        magicRecord.userid = userRecord.uuid
        await magicRecord.save()
        return userRecord
    },

    userInfoData: async (user) =>  {
        if (!user) return null
        const userToken = await jwt.jwtSign(user.uuid, 'user')
        const authToken = await jwt.jwtSign(user.uuid, 'auth')
        log.info(`${JSON.stringify(user)}`)
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