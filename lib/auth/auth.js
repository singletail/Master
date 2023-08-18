import * as jwt from '../../modules/jwt.mjs'
import session from '../session.js'
import userauth from './user.js'
import logger from '../../config/logger.mjs'
import wsOut from '../ws/out.js'
const log = logger.child({ src: import.meta.url })

// TODO: count failed attempts and block

const auth = {
    new: (id) => wsOut.req.auth.authToken(id),

    checkAuthToken: async (id, token) => {
        if (!token) {
            auth.noAuth(id)
            return
        }
        const payload = await jwt.checkAndVerifyToken(token)
        // log.warn(` !!! authToken cnf: ${payload.cnf} `)
        const userId = await session.idFromToken(token)
        userId ? auth.login(id, userId, token) : auth.noAuth(id)
    },

    noAuth: (id) => wsOut.req.auth.userToken(id),
    fail: (id) => wsOut.res.auth.fail(id),

    sendAuthToken: async (id, userId) => {
        const newToken = await jwt.jwtSign(userId, 'auth')
        wsOut.res.auth.authToken(id, newToken)
    },

    checkUserToken: async (id, token) => {
        const payload = await jwt.checkAndVerifyToken(token)
        //log.warn(` !!! userToken cnf: ${payload.cnf} `)
        const userId = await session.idFromToken(token)
        userId ? auth.login(id, userId, token) : auth.fail(id)
    },

    checkExpiry: async (id, userId, token) => {
        const claims = jwt.decodeToken(token)
        if (!claims || claims.exp > Date.now() / 1000 - 600)
            await auth.sendAuthToken(id, userId)
    },

    login: async (id, userId, token) => {
        const user = await session.userFromId(userId)
        if (!user) return
        const userData = userauth.userInfoData(user)
        auth.checkExpiry(id, userId, token)
        wsOut.res.auth.login(id, userData)
    },
}

export default auth
