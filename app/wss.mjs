import { WebSocketServer } from 'ws'
import { color } from '../config/colors.mjs'
import logger from '../config/logger.mjs'
import User from '../models/user.mjs'
import * as jwt from '../modules/jwt.mjs'

const log = logger.child({ src: import.meta.url })

let clients = {}

const h = `${color('pink')}[websockets]${color('cyan')}`

// duplicating code from a route because I'm lazy

const authenticate = async (req) => {
  let authUuid, userUuid, user, err
  if (req.cookies.auth) {
    let authPayload = await jwt.checkAndVerifyToken(req.cookies.auth)
    authUuid = authPayload.sub
  }
  if (!authUuid) {
    if (req.cookies.user) {
      let userPayload = await jwt.checkAndVerifyToken(req.cookies.user)
      userUuid = userPayload.sub
    }
  }
  if (authUuid) user = await User.findOne({ uuid: authUuid })
  if (!user && userUuid) user = await User.findOne({ uuid: userUuid })
  if (user) {
    if (user.isBanned || user.isLocked) {
      user = null
      err = { code: 401, message: 'User is banned or locked' }
    }
  }
  if (user) {
    let userdata = {
      uuid: user.uuid,
      isAuthenticated: true,
      username: user.username,
      displayName: user.displayName,
      level: user.level,
      email: user.email,
      geo: user.geo,
    }
    return userdata
  }
}

const wssServer = async (server) => {
  const wss = new WebSocketServer({ server })

  wss.on('connection', async (ws, req) => {
    ws.on('error', async (err) => {
      log.error(`${h} ${err}`)
    })

    ws.on('open', async () => {
      log.info(`${h} WSS Connection opened ${req.url}`)
      ws.send(`Welcome to n0.tel ${req.ip}`)
      /*
      let userdata = await authenticate(req)
      if (userdata) {
        ws.send(JSON.stringify(userdata))
      } else {
        ws.send(JSON.stringify({ isAuthenticated: false }))
      }
      */
      //const userId = req.headers['sec-websocket-key']
      //clients[userId] = ws
      //log.info(`${h} ${userId} connected`)
    })

    ws.on('message', async (msg) => {
      log.info(`${h} msg: ${msg}`)
      log.info(JSON.stringify(req.headers))
    })

    ws.on('close', async () => {
      log.info('${h} websocket closed')
    })

    ws.send('Hi from n0.tel')
  })

  return wss
}

export default wssServer
