import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import hpp from 'hpp'
import cookieParser from 'cookie-parser'
import { handler } from '../client/handler.js'

import config from '../config/config.mjs'
import initUserData from '../middleware/init.mjs'
import blacklist from '../middleware/blacklist.mjs'
import geolocation from '../middleware/geolocation.mjs'
import tracker from '../middleware/tracker.mjs'
import authenticate from '../middleware/userauth.mjs'
import expressLog from '../config/expressLogger.mjs'
import errorLog from '../config/errorLogger.mjs'
import trapRouter from '../routes/trap.mjs'
import indexRouter from '../routes/index.mjs'
import userRouter from '../routes/user.mjs'
import authRouter from '../routes/auth/auth.mjs'
import debugRouter from '../routes/debug.mjs'
import errorRouter from '../routes/errors.mjs'
import errorHandler from '../middleware/error.mjs'

const app = express()
app.set('trust proxy', true)
app.set('x-powered-by', false)
app.set('case sensitive routing', true)
app.set('views', '/var/dev/ai/server/views')
app.set('view engine', 'ejs')

app.use(helmet())
app.use(cors({ origin: config.clientOrigins }))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(hpp())
app.use(cookieParser())
app.use(express.static('static', config.static))
// app.use('/client', express.static('/var/dev/ai/client/build', config.client))

app.use(initUserData)
app.use(blacklist)
app.use(geolocation)
app.use(tracker)
app.use(authenticate)
app.use(expressLog)

app.use('/', trapRouter)
// app.use('/', indexRouter)
app.use('/user', userRouter)
app.use('/auth', authRouter)
app.use('/debug', debugRouter)
app.use(handler)
app.use('/', errorRouter)

app.use(errorLog)
app.use(errorHandler)

export default app
