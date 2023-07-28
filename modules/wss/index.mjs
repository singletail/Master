import WebSocket from 'ws'
import { v4 as uuidv4 } from 'uuid'
import wsServer from '../../app/wss.mjs'
import logger from '../../config/logger.mjs'

const log = logger.child({ src: import.meta.url })

const ws = {
  socketToId: {},
  idToSocket: {},

  id: 'sig_as_id_to_come',

  addSocket: (socket) => {
    let id = uuidv4()
    ws.socketToId[socket] = id
    ws.idToSocket[id] = { socket: socket, serial: 0 }
  },

  removeSocket: (id) => {
    let socket = ws.idToSocket[id].socket
    socket.terminate()
    ws.socketToId[socket] = null
    ws.idToSocket[id] = null
  },

  request: async (
    id,
    type = 'req',
    topic = 'sys',
    action = 'tick',
    data = {}
  ) => {
    let resObj = { ...res }
    resObj.data = {}
    for (const key in data) {
      resObj.data[key] = data[key] // add sanitize
    }

    resObj.type = type
    resObj.topic = topic
    resObj.action = action

    let socket = ws.check(id)
    if (!socket) {
      log.warn(`wss no socket. not sending: ${JSON.stringify(resObj)}`)
      return
    }
    ws.idToSocket[id].serial += 1
    resObj.serial = ws.idToSocket[id].serial
    log.info(`wss sending: ${JSON.stringify(resObj)}`)
    await socket.send(JSON.stringify(resObj))
  },

  check: (id) => {
    let socketObj = ws.idToSocket[id]
    if (!socketObj) {
      ws.removeSocket(id)
      return null
    }
    let socket = socketObj.socket
    return socket
  },

  broadcast: async (
    type = 'req',
    topic = 'sys',
    action = 'tick',
    data = {}
  ) => {
    for (const id in ws.idToSocket) {
      await ws.request(id, type, topic, action, data)
    }
  },

  tick: async (timerCount) => {
    let data = { count: timerCount }
    await ws.broadcast('req', 'sys', 'tick', data)
  },
}

let res = {
  origin: 'server',
  id: ws.id,
  serial: ws.counter,
}

export default ws
