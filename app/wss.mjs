import { WebSocketServer } from 'ws'
import * as ws from 'ws'
import { color } from '../config/colors.mjs'
import logger from '../config/logger.mjs'
import User from '../models/user.mjs'
import * as jwt from '../modules/jwt.mjs'

const log = logger.child({ src: import.meta.url })

let clients = {}
const h = `${color('pink')}[websockets]${color('cyan')}`

const wsServer = new WebSocketServer({ noServer: true })
wsServer.on('connection', (socket) => {
  socket.on('message', (data, isBinary) =>
    log.info(`ws msg: ${data} isBinary:${isBinary}`)
  )
  socket.on('error', (err) => log.error(`ws error: ${err}`))
  socket.on('upgrade', (request) => log.info(`ws upgrade: ${request}`))
  socket.on('close', (code, reason) =>
    log.info(`ws close: code:${code} reason:${reason}`)
  )
  socket.on('open', () => log.info(`ws open`))
  socket.on('ping', (data) => log.info(`ws ping ${data}`))
  socket.on('pong', (data) => log.info(`ws pong ${data}`))
})

export default wsServer

/*
    // Events
    on(event: "close", listener: (this: WebSocket, code: number, reason: Buffer) => void): this;
    on(event: "error", listener: (this: WebSocket, err: Error) => void): this;
    on(event: "upgrade", listener: (this: WebSocket, request: IncomingMessage) => void): this;
    on(event: "message", listener: (this: WebSocket, data: WebSocket.RawData, isBinary: boolean) => void): this;
    on(event: "open", listener: (this: WebSocket) => void): this;
    on(event: "ping" | "pong", listener: (this: WebSocket, data: Buffer) => void): this;

*/

/*
  wss.on('connection', (ws) => {
    ws.on('close', () => log.info('Client disconnected'))
    ws.on('error', (err) => log.error(err))
    ws.on('message', (data) => log.info(`ws msg: ${data}`))
    ws.on('open', (data) => log.info(`ws open: ${data}`))
  })
  */

/*
    ws.on('message', async (msg) => {
      log.info(`${h} msg: ${msg}`)
      log.info(JSON.stringify(req.headers))
    })

    ws.on('close', async () => {
      log.info(`${h} websocket closed`)
    })

    ws.send('Hi from n0.tel')
    */

/*
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
*/

/*
  wss.on('connection', async (ws, req) => {
    ws.on('error', async (err) => {
      log.error(`${h} ${err}`)
    })

    ws.on('open', async () => {
      log.info(`${h} WSS Connection opened ${req.url}`)
      ws.send(`Welcome to n0.tel ${req.ip}`)
      */

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
// })
