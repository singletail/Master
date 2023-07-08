import * as fs from 'node:fs'
import * as jose from 'jose'
import config from '../config/config.mjs'
import * as x from './util.mjs'
import logger from '../config/logger.mjs'

const log = logger.child({ src: import.meta.url })


const jwtPrivate = fs.readFileSync(config.jwt.private, 'utf8')
let keyPrivate = ''

const getKey = async () => {
  keyPrivate = await jose.importPKCS8(jwtPrivate, 'EdDSA')
}

getKey()

const claimCheck = async (jwt) => {
  let claims, valid
  try {
      claims = jose.decodeJwt(jwt)
  } catch (err) {
      log.error(`claims() jose.decodeJwt error: ${err}`)
  }
  if (claims.exp && claims.exp > x.now()) {
    valid = true
  }
  return valid
}

export const verify = async (jwt) => {
  let data, payload
  if (claimCheck(jwt)) {
    try {
      data = await jose.jwtVerify(jwt, keyPrivate, {
        issuer: config.url,
        audience: config.url,
      })
    } catch (err) {
      log.error(`claims() jose.decodeJwt error: ${err}`)
    }
    if (data && data.payload && data.payload.sub) {
      payload = data.payload
    }
  }
  return payload
}

const sign = async (jwtObj) => {
  const jwt = await new jose.SignJWT(jwtObj)
    .setProtectedHeader({ alg: 'EdDSA' })
    .setIssuedAt()
    .setIssuer(config.url)
    .setAudience(config.url)
    .sign(keyPrivate)
  return jwt
}

export const create = async (jwtType, sub) => {
  const exp = await x.jwtExpByType(jwtType)
  const jwtObj = {
    typ: 'JWT',
    sub: sub,
    exp: exp,
  }
  const jwt = await sign(jwtObj)
  return jwt
}
