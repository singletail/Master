import { WebSocketServer } from 'ws'
import logger from '../config/logger.mjs'

const log = logger.child({ src: import.meta.url })

const wssServer = (server) => {
  log.warn(server)
  const wss = new WebSocketServer({ server })

  wss.on('connection', (ws) => {
    ws.on('open', () => {
      log.info('open')
    })

    ws.on('message', (msg) => {
      log.info(`msg: ${msg}`)
    })

    ws.on('error', log.error)

    ws.on('close', () => {
      log.info('websocket closed')
    })

    ws.send('Hi from server')
  })

  return wss
}

export default wssServer
