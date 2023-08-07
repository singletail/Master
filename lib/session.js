/* Session -- tracks users for rest or ws sessions */
// TODO: Move ws tracking to ws library

import * as uuid from 'uuid'
import { checkAndVerifyToken } from '../modules/jwt.mjs'
import User from '../models/user.mjs'
import cookieSettings from '../modules/cookies.mjs'
import logger from '../config/logger.mjs'
import timer from './ws/timer.js'

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
    if (!token) return null
    const payload = await checkAndVerifyToken(token)
    log.info(`session.idFromToken() ${JSON.stringify(payload)}`)
    if (payload && 'sub' in payload) return payload.sub
  },

  userFromId: async (id) => {
    if (!id) return null
    const user = await User.findOne({ uuid: id })
    log.info(`session.userFromId() ${user.uuid}`)
    return user
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
    if (id && uuid.validate(id) === true) req.session = session.http[req.cookies.session]
    if (!req.session) {
      id = uuid.v4()
      const newSession = await session.new(req.cookies.auth)
      newSession.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
      session.http[id] = newSession
      req.session = session.http[id]
      log.info(`session.check() new session ${id}  ${JSON.stringify(req.session)}`)
      
      const cookieOptions = cookieSettings('session')
      log.info(`setting cookie ${JSON.stringify(cookieOptions)}`)
      res.cookie('session', id, cookieOptions)
    }
    next()
  },

  // ws

  wsCreate: (id, ip, socket) => {
    log.info('session.wsCreate()')
    const wsSession = { ...proto }
    wsSession.ip = ip
    wsSession.socket = socket
    wsSession.id = id
    return wsSession
  },

  wsNew: (id, socket, request) => {
    const ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress || null
    session.ws[id] = session.wsCreate(id, ip, socket)
    session.socket[socket] = id
    if (!timer.isRunning) timer.start()
    return session.ws[id]
  },

  wsDestroy: (id) => {
    const socket = session.ws[id].socket
    delete session.socket[socket]
    delete session.ws[id]
    log.info(`session.wsDestroy(${id})`)
    if (session.wsCount() < 1) timer.stop()
  },

  wsCount: () => {
    return Object.keys(session.ws).length
  },
}

export default session
