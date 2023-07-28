//import ws from './index.mjs'
import logger from '../../config/logger.mjs'

const log = logger.child({ src: import.meta.url })

const wsIn = {
  msg: (socket, data) => {
    log.info(`[wss/in][msg]: ${JSON.stringify(data)}`)
    //let resObj = { ...ws.res }
    /*
    let resObj = {}
    resObj.data = {}
    for (const key in data) {
      resObj.data[key] = data[key] // add sanitize
    }
    resObj.type = 'res'
    resObj.topic = 'sys'
    resObj.action = 'tick'
    socket.send(resObj)
    */
  },
}

export default wsIn
