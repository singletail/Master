const { WebSocketServer } = require('ws')
const log = require('../config/logger')(module)

const wssServer = (server) => {
    const wss = new WebSocketServer({
        server,
    })

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

module.exports = wssServer
