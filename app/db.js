const mongoose = require('mongoose')
const config = require('../config')
const log = require('../config/logger')(module)

mongoose.connection.on('connecting', () => {
    log.info(
        `Mongoose Connecting. readyState: ${mongoose.connection.readyState}`
    )
})
mongoose.connection.on('connected', () => {
    log.info(
        `Mongoose Connected. readyState: ${mongoose.connection.readyState}`
    )
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

async function db() {
    try {
        await mongoose.connect(config.db.uri)
    } catch (error) {
        log.error(`Mongoose Error ${error}`)
    }
}

module.exports = db
