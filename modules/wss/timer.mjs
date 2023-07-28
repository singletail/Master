import ws from './index.mjs'
import logger from '../../config/logger.mjs'

const log = logger.child({ src: import.meta.url })

let timerObj = {
  timerId: null,
  timerRunning: false,
  timerInterval: 5000,
  timerCount: 0,
}

const wsTimerTick = async () => {
  timerObj.timerCount++
  ws.tick(timerObj.timerCount)
}

const wsTimerCreate = async (ip, reason, request) => {
  if (timerObj.timerRunning) {
    log.warn(`[wsTimer] Not started: already running`)
    return
  }
  timerObj.timerRunning = true
  timerObj.timerId = setInterval(wsTimerTick, timerObj.timerInterval)
  log.info(`[wsTimer] started`)
}

export default wsTimerCreate
