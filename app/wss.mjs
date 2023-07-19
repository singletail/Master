import { WebSocketServer } from 'ws'
import { color } from '../config/colors.mjs'
import logger from '../config/logger.mjs'

const log = logger.child({ src: import.meta.url })

let clients = {}

const h = `${color('pink')}[websockets]${color('cyan')}`

//const wssServer = await CreateServer(server)
const wssServer = async (server) => {
  const wss = new WebSocketServer({ server })

  wss.on('connection', async (ws, req) => {

    ws.on('error', async (err) => {
      log.error(`${h} ${err}`)
    })

    ws.on('open', async () => {
      log.info(`${h} Connection opened ${req.url}`)
      log.info(JSON.stringify(req.headers))
      //const userId = uuidv4()
      //clients[userId] = ws
      //log.info(`${h} ${userId} connected`)
      log.info(JSON.stringify(req.headers))
      ws.send(`Welcome to n0.tel ${req.ip}`)
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
