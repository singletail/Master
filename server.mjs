import * as http from 'http'
import app from './app/app.mjs'
import config from './config/config.mjs'
import db from './app/db.mjs'
import wsServer from './app/wss.mjs'
import logger from './config/logger.mjs'

const log = logger.child({ src: import.meta.url })

let server
await db().then(() => {
  server = http.createServer(app)
})

//const server = http.createServer(app)

server.on('upgrade', (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, (socket) => {
    wsServer.emit('connection', socket, request)
  })
})

server.listen(config.port, () => {
  log.info('---------------------------------------------')
  log.info(`${config.url} v${config.port} ${config.nodeEnv}`)
  log.info(`Node ${process.version} ${process.platform} ${process.arch}`)
  log.info(`at ${new Date().toUTCString()}`)
  log.info(`DB ${config.db.uri}`)
  log.info(`HTTP ${server.address().port} max: ${server.getMaxListeners()} `)
  log.info('---------------------------------------------')
})
