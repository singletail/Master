import ws 
import logger from '../config/logger.mjs'

const log = logger.child({ src: import.meta.url })


const send = {
    rest: (res, status, message, data) => {
        const jsonres = {
            status: status,
            message: message,
            data: data,
        }
        res.status(status).json(jsonres)
    },

    ws: (ws, status, message, data) => {
        const jsonres = {
            status: status,
            message: message,
            data: data,
        }
        ws.send(JSON.stringify(jsonres))
    },
}

export default send