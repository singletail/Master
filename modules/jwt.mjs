import * as fs from 'node:fs'
import * as jose from 'jose'
import config from '../config/config.mjs'
import logger from '../config/logger.mjs'

const log = logger.child({ src: import.meta.url })

const jwtPrivate = fs.readFileSync(config.jwt.private, 'utf8')
let keyPrivate = ''

const getKey = async () => {
  keyPrivate = await jose.importPKCS8(jwtPrivate, 'EdDSA')
}

getKey()

const createJWT = async (uuid) => {
  const now = Math.floor(Date.now() / 1000)
  const data = {
    iss: config.url,
    aud: config.url,
    iat: now,
    jti: uuid,
  }
  return data
}

const signJWT = async (jwtObj) => {
  const now = Math.floor(Date.now() / 1000)
  const exp = now + 3600000
  const jwt = await new jose.SignJWT(jwtObj)
    .setProtectedHeader({ alg: 'EdDSA' })
    .setIssuedAt()
    .setExpirationTime(exp)
    .setIssuer(config.url)
    .setAudience(config.url)
    .sign(keyPrivate)
  return jwt
}

const verifyJWT = async (jwt) => {
  let verification
  const now = Math.floor(Date.now() / 1000)
  const claims = jose.decodeJwt(jwt)
  if (claims.exp && claims.exp > now) {
    const { payload } = await jose.jwtVerify(jwt, keyPrivate, {
      issuer: config.url,
      audience: config.url,
    })
    if (!payload.jti) {
      log.warn(`warning: bad payload ${jwt}`)
    } else {
      verification = payload.jti
    }
  } else {
    log.warn('token expired')
  }
  return verification
}

export default { createJWT, signJWT, verifyJWT }
