const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const config = require('../config');
const initUserData = require('../middleware/init');
const blacklist = require('../middleware/blacklist');
const geolocation = require('../middleware/geolocation');
const tracker = require('../middleware/tracker');
const authenticate = require('../middleware/userauth');
const log = require('../config/logger.js')(module);
const expressLog = require('../middleware/expressLogger.js');
const errorLog = require('../middleware/errorLogger.js');
const trapRouter = require('../routes/trap.js');
const indexRouter = require('../routes/index.js');
const userRouter = require('../routes/user.js');
const authRouter = require('../routes/auth.js');
const debugRouter = require('../routes/debug.js');
const errorRouter = require('../routes/errors.js');
const errorHandler = require('../middleware/error.js');

const app = express();
app.set('trust proxy', true);
app.set('x-powered-by', false);
app.set('case sensitive routing', true);
app.set('views', '/var/dev/ai/server/views');
app.set('view engine', 'ejs');

app.use(helmet());
app.use(cors({ origin: config.clientOrigins }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(hpp());
app.use(cookieParser());
app.use(express.static('static', config.static));

app.use(initUserData);
app.use(blacklist);
app.use(geolocation);
app.use(tracker.check);
app.use(authenticate);
app.use(expressLog);

app.use('/', trapRouter);
app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/auth', authRouter);
app.use('/debug', debugRouter);
app.use('/', errorRouter);

app.use(errorLog);
app.use(errorHandler);
module.exports = app;
