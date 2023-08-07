import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import expressLog from '../config/expressLogger.mjs'
import errorLog from '../config/errorLogger.mjs'

import config from '../config/config.mjs'
import session from '../lib/session.js'
import ban from '../lib/ban.js'

import ejs from 'ejs'
// import { handler as clientHandler } from '../client/handler.js'

import trapRouter from '../routes/trap.mjs'
import indexRouter from '../routes/index.mjs'
import apiRouter from '../routes/api/index.mjs'
import errorRouter from '../routes/errors.mjs'

import errorHandler from '../middleware/error.mjs'

import logger from '../config/logger.mjs'
const log = logger.child({ src: import.meta.url })

const app = express()

app.set('trust proxy', true)
app.set('x-powered-by', false)
app.set('case sensitive routing', true)
app.set('views', './views')
ejs.clearCache()
app.set('view engine', 'ejs')

app.use(helmet({ crossOriginEmbedderPolicy: false }))
app.use(cors(config.cors))
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }))
app.use(express.static('static', config.static))

app.use(ban.req)
app.use(session.check)

// app.use(authenticate)
// app.use(userdata)
app.use(expressLog)

app.use('/', trapRouter)
app.use('/', indexRouter)
app.use('/api', apiRouter)

// app.use(clientHandler)

app.use('/', errorRouter)
app.use(errorLog)
app.use(errorHandler)

log.info(`[ban.cache]: ${JSON.stringify(ban.init())}`)

export default app
