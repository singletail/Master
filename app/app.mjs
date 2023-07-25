import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import hpp from 'hpp'
import cookieParser from 'cookie-parser'

import config from '../config/config.mjs'
import initUserdata from '../middleware/init.mjs'
import blacklist from '../middleware/blacklist.mjs'
import geolocation from '../middleware/geolocation.mjs'
import tracker from '../middleware/tracker.mjs'
import authenticate from '../middleware/userauth.mjs'
import userdata from '../middleware/userdata.mjs'
import expressLog from '../config/expressLogger.mjs'
import errorLog from '../config/errorLogger.mjs'

import { handler as clientHandler } from '../client/handler.js';

import trapRouter from '../routes/trap.mjs'
import cspRouter from '../routes/csp.mjs'
import indexRouter from '../routes/index.mjs'
import userRouter from '../routes/user.mjs'
//import authRouter from '../routes/auth/auth.mjs'
import apiRouter from '../routes/api/index.mjs'
import debugRouter from '../routes/debug.mjs'
import errorRouter from '../routes/errors.mjs'
import errorHandler from '../middleware/error.mjs'
import { refreshBanCache, banList } from '../modules/ban.mjs'

import logger from '../config/logger.mjs'
const log = logger.child({ src: import.meta.url })

const app = express()
app.set('trust proxy', true)
app.set('x-powered-by', false)
app.set('case sensitive routing', true)
app.set('views', '/var/dev/ai/server/views')
app.set('view engine', 'ejs')

const corsOptions = {
    origin: ['http://n0.tel', 'http://*.n0.tel', 'ws://n0.tel'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
}

app.use(cors({'origin': '*'}))
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(hpp())
app.use(cookieParser())
app.use(express.static('static', config.static))

app.use(initUserdata)
app.use(blacklist)
app.use(geolocation)
app.use(tracker)
app.use(authenticate)
app.use(userdata)
app.use(expressLog)

app.use('/', trapRouter)
app.use('/', cspRouter)
app.use('/user', userRouter)
app.use('/api', apiRouter)
app.use('/debug', debugRouter)

app.use(clientHandler);

app.use('/', errorRouter)
app.use(errorLog)
app.use(errorHandler)

//log.info(`Config: ${JSON.stringify(config)}`);
//log.info(`Origin: ${JSON.stringify(process.env.ORIGIN)}`);

let localBanList = await refreshBanCache()
log.info(`${localBanList.length} Bans: ${JSON.stringify(localBanList)}`)

// config.nodeEnv



export default app
