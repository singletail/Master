import { mongoose } from 'mongoose'
import config from '../config/config.mjs'
import logger from '../config/logger.mjs'

const log = logger.child({ src: import.meta.url })
const mongoDB = config.db.uri

const db = async () => {
  await mongoose.connect(mongoDB)
}

db().catch((err) => log.error(err))

mongoose.connection.on('error', (err) => log.error(`db conn err ${err}`))
mongoose.connection.on('connecting', () => log.info(`db conn try ${mongoDB}`))
mongoose.connection.on('connected', () => log.info(`db conn ok ${mongoDB}`))
mongoose.connection.on('disconnecting', () => log.warn(`db disconnecting`))
mongoose.connection.on('disconnected', () => log.warn(`db disconnected`))

process.on('SIGINT', async () => {
  log.warn(`db disconnect SIGINT`)
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
