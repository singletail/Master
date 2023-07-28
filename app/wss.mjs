import { WebSocketServer } from 'ws'
import wsTimerCreate from '../modules/wss/timer.mjs'
import { banCheck, banUpdate } from '../modules/ban.mjs'
import { color } from '../config/colors.mjs'
import logger from '../config/logger.mjs'
import User from '../models/user.mjs'
import * as jwt from '../modules/jwt.mjs'
import ws from '../modules/wss/index.mjs'
import wsIn from '../modules/wss/in.mjs'

const log = logger.child({ src: import.meta.url })

const h = `${color('pink')}[websockets]${color('cyan')}`

const wsOptions = {
  noServer: true,
  clientTracking: true,
}

const wsServer = new WebSocketServer(wsOptions)
wsTimerCreate()

wsServer.on('error', (err) => log.error(`${h}[error] ${err}`))

wsServer.on('headers', (headers, request) => {
  let parsed = parseHeaders(headers, request)
  //log.info(`${h}[headers][parsed] ${JSON.stringify(parsed)}`)
  request['parsed'] = parsed
})

wsServer.on('listening', () => log.info(`${h}[listening]`))

wsServer.on('wsClientError', (err) => log.error(`${h}[wsClientError] ${err}`))

wsServer.on('connection', (socket, request) => {
  if (!request['parsed']) log.warn(`${h}[connection][request][parsed] null`)
  if (request['parsed'].isBanned === true) {
    log.warn(`${h}[connection][request][parsed] isBanned: true`)
    socket.close()
    return
  }

  let clientId = ws.addSocket(socket)

  log.info(`${h}[connect][${clientId}] ${JSON.stringify(request['parsed'])}`)

  //socket.on('message', (data, isBinary) =>
  ;(socket.onmessage = (event) => {
    wsIn.msg(ws.socketToId[socket], event.data)
    //log.info(`${h}[incoming]${color('yellow')} ${data}`);
    wsIn.msg(ws.socketToId[socket], data)
    log.info(`${h}[incoming] ${JSON.stringify(event)}`)
  }),
    socket.on('error', (err) => log.error(`ws error: ${err}`))

  socket.on('upgrade', (request) => log.info(`ws upgrade: ${request}`))

  socket.on('close', (code, reason) =>
    log.info(`ws close: code:${code} reason:${reason}`)
  )

  socket.on('open', () => log.info(`ws open`))

  socket.on('ping', (data) => log.info(`ws ping ${data}`))

  socket.on('pong', (data) => log.info(`ws pong ${data}`))
})

const parseHeaders = (headers, request) => {
  let parsed = { isBanned: true }
  for (let i = 0; i < request['rawHeaders'].length; i += 2) {
    if (
      ['User-Agent', 'X-Forwarded-For', 'Sec-Websocket-Key', 'Origin'].includes(
        request['rawHeaders'][i]
      )
    )
      parsed[request['rawHeaders'][i]] = request['rawHeaders'][i + 1]
  }
  parsed.isBanned = banCheck(parsed['X-Forwarded-For'])
  return parsed
}

export default wsServer
