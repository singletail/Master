import express from 'express'
import { login, checkMagicLink } from '../../../modules/auth/email.mjs'
import logger from '../../../config/logger.mjs'
import cookieSettings from '../../../modules/cookies.mjs'

const log = logger.child({ src: import.meta.url })
const router = express.Router()

router.get('/', async (req, res) => {
  const jsonres = {
    status: '/api/auth get ok',
    userdata: req.userdata,
  }
  res.json(jsonres)
})

router.get('/token', async (req, res) => {
  if (!req.query.email || !req.query.token)
    res.status(400).send({ error: 'Missing Credentials.' })
  let userdata = await checkMagicLink(
    req.query.email,
    req.query.token,
    req.headers.origin
  )
  if (!userdata.userToken || !userdata.authToken)
    res.status(403).send({ error: 'Invalid token.' })
  const userOptions = cookieSettings('user')
  const authOptions = cookieSettings('auth')
  res.cookie('user', userdata.userToken, userOptions)
  res.cookie('auth', userdata.authToken, authOptions)
  res.status(200).send({
    message: 'Login Successful',
    user: {
      uuid: userdata.uuid,
      username: userdata.username,
      displayName: userdata.displayName,
      authToken: userdata.authToken,
      userToken: userdata.userToken,
    },
  })
  res.end()
})

router.post('/login', async (req, res) => {
  if (!req.body.email) res.status(400).send({ error: 'Email not provided.' })
  let loginResults = await login(req.body.email, req.ip, req.headers.origin)
  if (loginResults.messageId) {
    res.status(201).send({ message: 'Email sent.' })
  } else {
    res.status(500).send({ error: 'Error.' })
  }
  res.end()
})

router.post('/client', async (req, res) => {
  log.info(`req.body: ${JSON.stringify(req.body)}`)
  if (!req.body.email || !req.body.token)
    res.status(400).send({ error: 'Missing Credentials.' })
  let userdata = await checkMagicLink(
    req.body.email,
    req.body.token,
    'https://dev.n0.tel'
  )
  log.info(`userdata from checkMagicLink: ${JSON.stringify(userdata)}`)
  if (!userdata.userToken || !userdata.authToken)
    res.status(403).send({ error: 'Invalid token.' })
  const userOptions = cookieSettings('user')
  const authOptions = cookieSettings('auth')
  res.cookie('user', userdata.userToken, userOptions)
  res.cookie('auth', userdata.authToken, authOptions)
  res.status(200).send({
    message: 'Login Successful',
    user: {
      uuid: userdata.uuid,
      username: userdata.username,
      displayName: userdata.displayName,
      authToken: userdata.authToken,
      userToken: userdata.userToken,
    },
  })
  res.end()
})

// 201 if new account was created
// 202 if email was sent
// 400 if email was not provided
// 401 if email was not found
// 403 if email was found but token was invalid
// 406 for shenanegans
// 423 if banned
// 500 if something else went wrong
// 501 if I haven't written it yet

export default router
