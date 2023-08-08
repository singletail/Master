import { WebSocketServer } from 'ws'
import { color } from '../config/colors.mjs'
import logger from '../config/logger.mjs'
import sock from '../lib/ws/sock.js'
import timer from '../lib/ws/timer.js'

const log = logger.child({ src: import.meta.url })
const h = `${color('pink')}[websockets]${color('cyan')}`

const wsOptions = {
  noServer: true,
  clientTracking: false,
}

const wsServer = new WebSocketServer(wsOptions)

wsServer.onerror = (err) => log.error(`${h}[error] ${err}`)
wsServer.onclose = (e) => log.warn(`${h}[close] ${e.wasClean} ${e.code} ${e.reason}`)

wsServer.on('connection', (socket, request) => {
  const id = request.headers['sec-websocket-key']
  sock.new(id, socket, request)
  socket.on('error', (error) => sock.error(id, error))
  socket.on('message', (message) => sock.message(id, message))
  socket.on('close', () => sock.close(id))
})

timer.start()

export default wsServer
