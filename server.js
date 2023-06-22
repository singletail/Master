const { createServer } = require('http')
const app = require('./app')
const config = require('./config')
const db = require('./app/db')
const log = require('./config/logger')(module)
const wssServer = require('./app/wss')

db()

const server = createServer(app)
const wss = wssServer(server)

server.listen(config.port, () => {
    log.info('---------------------------------------------')
    log.info(`${config.name} v${config.version} ${config.description}`)
    log.info(`${config.url} v${config.port} ${config.nodeEnv}`)
    log.info(`Node ${process.version} ${process.platform} ${process.arch}`)
    log.info(`at ${new Date().toUTCString()}`)
    log.info(`DB ${config.db.uri}`)
    log.info(`HTTP ${server.address().port} max: ${server.getMaxListeners()} `)
    log.info(`WSS ${wss.address().port} max: ${wss.getMaxListeners()} `)
    log.info('---------------------------------------------')
})
