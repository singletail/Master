/* Session -- tracks users for rest or ws sessions */
// TODO: Move ws tracking to ws library

import * as uuid from 'uuid'
import { checkAndVerifyToken } from '../modules/jwt.mjs'
import User from '../models/user.mjs'
import cookieSettings from '../modules/cookies.mjs'
import logger from '../config/logger.mjs'

const log = logger.child({ src: import.meta.url })

const proto = {
    userId: null,
    isBanned: false,
    id: null,
    ip: null,
    userName: null,
    displayName: 'Guest',
    email: null,
    level: 0,
    socket: null,
}

const session = {
    http: {},
    ws: {}, // key = id, value = { ip, socket, displayName, etc}
    socket: {}, // key = socket, value = id

    idFromToken: async (token) => {
        const payload = await checkAndVerifyToken(token)
        if (payload && 'sub' in payload) return payload.sub
    },

    userFromId: async (id) => {
        if (!id) return null
        return await User.findOne({ uuid: id })
    },

    sessionForUser: (user) => {
        const session = { ...proto }
        if (user) {
            session.userId = user.uuid
            session.userName = user.name
            session.level = user.level
        }
        return session
    },

    new: async (authCookie) => {
        log.info('session.new()')
        const userId = await session.idFromToken(authCookie)
        const user = await session.userFromId(userId)
        const newSession = session.sessionForUser(user)
        return newSession
    },

    check: async (req, res, next) => {
        let id = req.cookies.session
        if (id && uuid.validate(id) === true)
            req.session = session.http[req.cookies.session]
        if (!req.session) {
            id = uuid.v4()
            const newSession = await session.new(req.cookies.auth)
            newSession.ip =
                req.headers['x-forwarded-for'] || req.connection.remoteAddress
            session.http[id] = newSession
            req.session = session.http[id]
            const cookieOptions = cookieSettings('session')
            res.cookie('session', id, cookieOptions)
        }
        next()
    },

    // ws

    wsCreate: (id, ip, socket) => {
        const wsSession = { ...proto }
        wsSession.ip = ip
        wsSession.socket = socket
        wsSession.id = id
        return wsSession
    },

    wsNew: (id, socket, request) => {
        const ip =
            request.headers['x-forwarded-for'] ||
            request.connection.remoteAddress ||
            null
        session.ws[id] = session.wsCreate(id, ip, socket)
        session.socket[socket] = id
        return session.ws[id]
    },

    wsDestroy: (id) => {
        const socket = session.ws[id].socket
        delete session.socket[socket]
        delete session.ws[id]
    },

    wsCount: () => {
        return Object.keys(session.ws).length
    },
}

export default session
