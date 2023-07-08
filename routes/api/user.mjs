import express from 'express'
import Joi from 'joi'
import * as users from '../../modules/users.mjs'
import * as jwt from '../../modules/jwt.mjs'
import * as x from '../../modules/util.mjs'
import logger from '../../config/logger.mjs'

const log = logger.child({ src: import.meta.url })
const router = express.Router()

const regSchema = Joi.object({
    username: Joi.string()
        .min(3)
        .max(30)
        .required(),

    password: Joi.string()
        .required()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

    repeat_password: Joi.ref('password'),
})


router.post('/login', async (req, res) => {
    log.info(`POST /api/user/login ${req.ip} ${req.body.user.username} ${req.body.user.password}`)
    
    log.info(`${JSON.stringify(req.body)}`)
    let err, user, username, password
    log.info(`API login req.body.user.username: ${req.body.user.username}`)
    //log.info(`API login req.body.user.username: ${req.body.user.username}`)
    if (req.body.user.username) {
        username = req.body.user.username
        password = req.body.user.password
    //} else if (req.body.user.username) {
    //    username = req.body.user.username
    //    password = req.body.user.password
    }
    if (!username || !password) {
        err = { code: 422, msg: [`username and password are required`]}
    } else {
        user = await users.loginUserPassword(
          username,
          password,
          req.ip,
          req.tracker.uuid
        )
    }
    if (!user) {
        log.info(`user ${username} not found`)
        err = { code: 401, msg: [`invalid username or password`]}
    }
    if (!err) {
        log.info(`user ${username} found. generating tokens.`)
        req.user = user
        const userToken = await jwt.create('user', user.uuid )
        const authToken = await jwt.create('auth', user.uuid )
        if (!userToken || !authToken) {
            err = { code: 500, msg: [`token creation error for ${username}`]}
        } else {
            log.info(`saving tokens to cookies.`)
            const userExp = await x.cookieExpByType('user')
            res.cookie('user', userToken, {
              httpOnly: true,
              secure: true,
              sameSite: 'Strict',
              expires: userExp,
            })
            const authExp = await x.cookieExpByType('auth')
            res.cookie('auth', authToken, {
              httpOnly: true,
              secure: true,
              sameSite: 'Strict',
              expires: authExp,
            })
        }
        res.status(200).json({ userdata: req.userdata })
    } else {
        res.status(err.code).json({ errors: err.msg })
    }
    res.end()
})

router.post('/register', async (req, res) => {
    log.info(`Pre-validation: ${JSON.stringify(req.body)}`)
    let err, username, password, user
    const val = regSchema.validate({
        username: req.body.username, 
        password: req.body.password,
        repeat_password: req.body.repeat_password,
    })
    if (val.error) {
        log.warn(`user registration validation error: ${val.error.message}`)
        err = { code: 422, msg: []}
        for (let e = 0; e < val.error.details.length; e++) {
            err.msg.push(val.error.details[e].message)
        }
    } else {
        username = val.value.username
        password = val.value.password
    }
    
    log.info(`Post-validation: ${username} ${password}`)

    if (!username || !password) {
        log.warn(`user registration validation error: ${err.message}`)
        err = { code: 422, msg: [`username and password are required`]}
    }
    if (!err) {
        log.info(`Looking up user: ${username} `)
        const userRecord = await users.findByUsername(username)
        if (userRecord) {
            log.warn(`user ${req.body.username} already exists`)
            err = { code: 409, msg: [`user ${req.body.username} already exists`]}
        }
    }
    if (!err) {
        log.info(`User does not exist. Creating ${username} ${password} ${req.tracker.uuid} `)
        user = await users.createWithPassword(username, password, req.tracker.uuid)
    }
    if (!user) {
        err = { code: 500, msg: [`user ${req.body.username} could not be created`]}
    }
    if (!err) {
        log.info(`Created user, now creating tokens.`)
        const userToken = await jwt.create('user', user.uuid )
        const authToken = await jwt.create('auth', user.uuid )
        log.info('Writing Cookies:')
        log.info(userToken)
        log.info(authToken)
        const userExp = await x.cookieExpByType('user')
        res.cookie('user', userToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'Strict',
          expires: userExp,
        })
        const authExp = await x.cookieExpByType('user')
        res.cookie('auth', authToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'Strict',
          expires: authExp,
        })
        log.info(`setting status to 201`)
        res.status(201).json({ 
            message: 'User created',
            user: {
                uuid: user.uuid,
                username: user.username,
                displayName: user.displayName,
            },
        })
    } else {
        log.info(`user creation error ${err.code} ${err.msg}`)
        res.status(err.code).json({ errors: err.msg });
    }
    res.end()
})



router.post('/data', async (req, res) => {
    log.info(`POST /api/user/data ${req.ip}`)
    res.status(200).json({ userdata: req.userdata })
    res.end()
})

router.post('/logout', async (req, res) => {
    log.info(`POST /api/user/logout ${req.ip}`)
    res.clearCookie('user')
    res.clearCookie('auth')
    res.status(200).json({ message: 'logged out' })
    res.end();
})

export default router
