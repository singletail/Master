const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

//const winston = require('winston');
//const expressWinston = require('express-winston');

const config = require('../config');
//const ip = require('../middleware/ip');
//const geolocation = require('../middleware/geolocation');
//const localTime = require('../middleware/localtime');
//const tracker = require('../middleware/tracker');
//const userauth = require('../middleware/userauth');
//const admin_headers = require('../middleware/adminheaders');

//const banRouter = require('../routes/ban.js');
const indexRouter = require('../routes/index.js');
//const mainRouter = require('../routes/main.js');
//const authRouter = require('../routes/auth');
//const userRouter = require('../routes/user');
//const adminRouter = require('../routes/admin');
const errorRouter = require('../routes/errors.js');
const errorHandler = require('../middleware/error.js');

const app = express();

app.use(helmet());
app.use(cors({ origin: config.clientOrigins }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(hpp());
app.use(cookieParser());
app.use(express.static('static', config.static));

app.set('trust proxy', true);
app.set('x-powered-by', false);
app.set('case sensitive routing', true);
app.set('views', '/var/dev/ai/server/views');
app.set('view engine', 'ejs');

//app.use(ip.real_ip);
//app.use(geolocation);
//app.use(localTime);
//app.use(tracker.check);
//app.use(userauth.checkuser);
//app.use(admin_headers);

/*
app.use(function (req, res, next) {
  res.setHeader(
    'Content-Security-Policy-Report-Only',
    "default-src 'self'; media-src 'self'; font-src 'self'; img-src 'self'; script-src 'self'; style-src 'self'; frame-src 'self'"
  );
  next();
});
*/

/*
app.use(
  expressWinston.logger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.cli()
    ),
    meta: true,
    //msg: '{{req.real_ip}}  {{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}} ',
    msg: `{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}} `,
    expressFormat: false,
    colorize: true,
  })
);
*/

//app.use('/', banRouter);
app.use('/', indexRouter);
//app.use('/', mainRouter);
//app.use('/auth', authRouter);
//app.use('/user', userRouter);
//app.use('/admin', adminRouter);
app.use('/', errorRouter);
app.use(errorHandler);

module.exports = app;
