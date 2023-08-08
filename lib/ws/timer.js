import wsOut from './out.js'
import sock from './sock.js'
import logger from '../../config/logger.mjs'

const log = logger.child({ src: import.meta.url })

const timer = {
    obj: null,
    isRunning: null,
    interval: 24000,
    count: 0,

    tick: () => {
        if (timer.isRunning !== true) return
        timer.count++
        sock.broadcast(wsOut.packVals('req', 'sys', 'ping', { count: timer.count }))
    },

    start: () => {
        if (timer.isRunning === true) return
        timer.isRunning = true
        timer.obj = setInterval(timer.tick, timer.interval)
        log.info(`[timer] started, interval: ${timer.interval}`)
    },

    stop: () => {
        timer.obj = null
        timer.isRunning = null
        log.info(`[timer] stopped after count: ${timer.count}`)
        timer.count = 0
    },

}

export default timer
