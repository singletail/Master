import WebSocket from 'ws'
import wsServer from '../../app/wss.mjs'
import logger from '../../config/logger.mjs'

const log = logger.child({ src: import.meta.url })

const broadcast = (data) => {
  if (wsServer.clients.size > 0) {
    wsServer.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data)
      }
    })
  }
}

export const wsMsgTick = async (timerCount) => {
  let ts = Math.floor(Date.now() / 1000)
  let msg = {
    type: 'timer',
    ts: ts,
    count: timerCount,
  }
  broadcast(JSON.stringify(msg))
  //log.info(`[wsMsgTimer] count: ${timerCount}`)
}
