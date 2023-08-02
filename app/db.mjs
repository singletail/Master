import process from 'node:process'
import { mongoose } from 'mongoose'
import logger from '../config/logger.mjs'

const log = logger.child({ src: import.meta.url })


const db = {

  connect: async (uri) => {
    try {
      await mongoose.connect(uri)
    } catch (error) {
      log.error(`Mongoose Error ${error}`)
    }

    mongoose.connection.onnerror = (err) => log.error(`Mongoose Error ${err}`)
    mongoose.connection.onconnecting = () => log.info('Mongoose Connecting.')
    mongoose.connection.ondisconnecting = () => log.info('Mongoose Disconnecting.')
    mongoose.connection.ondisconnected = () => log.error('Mongoose Disconnected.')
    
  },

  disconnect: async () => {
    await mongoose.connection.close().then(process.exit(0))
  },
}

export default db






/*
const db = async () => {
  await mongoose.connect(mongoDB)
}

db().catch((err) => {
return log.error(err)
})

mongoose.connection.on('error', (err) => {
return log.error(`db conn err ${err}`)
})
mongoose.connection.on('connecting', () => {
return log.info(`db conn try ${mongoDB}`)
})
mongoose.connection.on('connected', () => {
return log.info(`db conn ok ${mongoDB}`)
})
mongoose.connection.on('disconnecting', () => {
return log.warn('db disconnecting')
})
mongoose.connection.on('disconnected', () => {
return log.warn('db disconnected')
})

process.on('SIGINT', async () => {
  log.warn('db disconnect SIGINT')
  await mongoose.connection.close().then(process.exit(0))
})

export const dbStatus = () => {
  // 0 = disconnected
  // 1 = connected
  // 2 = connecting
  // 3 = disconnecting
  return mongoose.connection.readyState
}

export default db
*/



/*
mongoose.connection.on('connecting', () => {
  log.info(`Mongoose Connecting. readyState: ${mongoose.connection.readyState}`)
})
mongoose.connection.on('connected', () => {
  log.info(`Mongoose Connected. readyState: ${mongoose.connection.readyState}`)
})
mongoose.connection.on('disconnecting', () => {
  log.info(
    `Mongoose Disconnecting. readyState: ${mongoose.connection.readyState}`
  )
})
mongoose.connection.on('disconnected', () => {
  log.info(
    `Mongoose Disconnected. readyState: ${mongoose.connection.readyState}`
  )
})
*/

/*
const db = async () => {
  try {
    await mongoose.connect(config.db.uri)
  } catch (error) {
    log.error(`Mongoose Error ${error}`)
  }
}

export default db
*/
