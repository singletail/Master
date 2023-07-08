import express from 'express'
import SimpleWebAuthnServer from '@simplewebauthn/server'
import logger from '../../config/logger.mjs'

const log = logger.child({ src: import.meta.url })

const router = express.Router()

let chal = ''

router.get('/login', async (req, res) => {
  const data = {
    title: 'Login',
    msg: 'Select Authentication Method.',
  }
  res.render('login', { data, user: req.userdata })
})

router.get('/webauthn/generate', async (req, res) => {
  const rpName = 'cyberpunk.nyc'
  const rpID = 'cyberpunk.nyc'
  // const origin = `https://${rpID}`
  const options = SimpleWebAuthnServer.generateRegistrationOptions({
    rpName,
    rpID,
    userID: 'fake-user-id',
    username: 'fake-user-name',
    attestationType: 'none',
    // Prevent users from re-registering existing authenticators
    /*
        excludeCredentials: userAuthenticators.map((authenticator) => ({
            id: authenticator.credentialID,
            type: 'public-key',
            // Optional
            transports: authenticator.transports,
        })),
        */
  })
  log.info(`WebAuthn Registration Request: ${JSON.stringify(options)}`)
  chal = options.challenge
  res.json(options)
})

router.post('/webauthn/verify', async (req, res, next) => {
  let verification
  try {
    verification = await SimpleWebAuthnServer.verifyRegistrationResponse({
      response: req,
      chal,
      expectedOrigin: origin,
      expectedRPID: 'cyberpunk.nyc',
    })
  } catch (error) {
    log.error(error)
    return res.status(400).send({ error: error.message })
  }
  const { verified } = verification
  log.info(`WebAuthn Registration Verified: ${JSON.stringify(verified)}`)
  res.json(verified)
  next()
})

export default router
