import { createServer } from 'http'
import app from './app/app.mjs'
import config from './config/config.mjs'
import db from './app/db.mjs'
// import wssServer from './app/wss.mjs'
import log from './config/logger.mjs'
// import * as logger from './config/logger.mjs'

// const log = logger(module)

db()

const server = createServer(app)
// const wss = wssServer(server)

server.listen(config.port, () => {
  log.info('---------------------------------------------')
  // log.info(`${config.name} v${config.version} ${config.description}`)
  log.info(`${config.url} v${config.port} ${config.nodeEnv}`)
  log.info(`Node ${process.version} ${process.platform} ${process.arch}`)
  log.info(`at ${new Date().toUTCString()}`)
  log.info(`DB ${config.db.uri}`)
  log.info(`HTTP ${server.address().port} max: ${server.getMaxListeners()} `)
  // log.info(`WSS ${wss.address().port} max: ${wss.getMaxListeners()} `)
  log.info('---------------------------------------------')
})