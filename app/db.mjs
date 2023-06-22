import { mongoose } from 'mongoose'
import config from '../config/config.mjs'
import log from '../config/logger.mjs'
// import * as logger from '../config/logger.mjs'

// const log = logger(module)

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

const db = async () => {
  try {
    await mongoose.connect(config.db.uri)
  } catch (error) {
    log.error(`Mongoose Error ${error}`)
  }
}

export default db
