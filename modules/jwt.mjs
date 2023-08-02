import * as fs from 'node:fs'
import * as jose from 'jose'
import config from '../config/config.mjs'
import logger from '../config/logger.mjs'

// Note: Jose expiration expects a unix timestamp integer in seconds.

const log = logger.child({ src: import.meta.url })

const jwtPrivate = fs.readFileSync(config.jwt.private, 'utf8')
let keyPrivate = ''

const getKey = async () => {
  keyPrivate = await jose.importPKCS8(jwtPrivate, 'EdDSA')
}

getKey()

//------- new:

export const areClaimsValid = (jwt) => {
  let jwtDateValid
  const claims = jose.decodeJwt(jwt)
  const nowCheck = now()
  if (claims.exp && claims.exp > nowCheck) {
    jwtDateValid = true
  }
  return jwtDateValid
}

export const decodeToken = (jwt) => {
  const claims = jose.decodeJwt(jwt)
  return claims
}

export const verifyToken = async (jwt, origin = 'https://n0.tel') => {
  let issuer = 'https://n0.tel'
  if (origin === 'http://dev.n0.tel') {
    issuer = origin
  }
  //log.info(`jwtSign( ${valueString}, ${valType}, ${origin}, ${issuer} )`)
  const { payload } = await jose.jwtVerify(jwt, keyPrivate, {
    issuer: issuer,
    audience: issuer,
  })
  return payload
}

export const jwtSign = async (
  valueString,
  valType = 'auth',
  origin = 'https://n0.tel',
) => {
  log.info(`jwtSign( ${valueString}, ${valType}, ${origin} )`)
  let issuer = 'https://n0.tel'
  if (origin === 'http://dev.n0.tel') {
issuer = origin
}
  log.info(`jwtSign( ${valueString}, ${valType}, ${origin}, ${issuer} )`)
  const exp = expTime(valType)
  const jwt = await new jose.SignJWT({ sub: valueString })
    .setProtectedHeader({ alg: 'EdDSA' })
    .setIssuedAt()
    .setIssuer(issuer)
    .setAudience(issuer)
    .setExpirationTime(exp)
    .sign(keyPrivate)
  return jwt
}

export const checkAndVerifyToken = async (token, origin = 'https://n0.tel') => {
  if (origin !== 'https://n0.tel' && origin !== 'https://dev.n0.tel') {
return null
}
  log.info(`origin for token is ${origin}`)
  const valid = areClaimsValid(token)
  if (!valid) {
    return null
  }
  const payload = await verifyToken(token, origin)
  return payload
}

const now = () => {
  return Math.floor(Date.now().valueOf() / 1000)
}

const expByType = {
  auth: 3600, // 1 hour
  user: 2592000, // 30 days
  tracker: 34560000, // 400 days
}

export const expTime = (type) => {
  const exp = now() + expByType[type]
  return exp
}

// ----------- old:

/*
const claimCheck = async (jwt) => {
  log.info(`about to check claims for ${jwt}`)
  let claims, valid
  try {
    claims = jose.decodeJwt(jwt)
  } catch (err) {
    log.error(`claims() jose.decodeJwt error: ${err}`)
  }
  if (claims.exp && claims.exp > now) {
    valid = true
  }
  return valid
}

export const verify = async (jwtToken) => {
  log.warn(`OLD about to verify ${jwtToken}`)
  let data, payload
  let claims = await claimCheck(jwtToken)
  if (claims) {
    try {
      data = await jose.jwtVerify(jwtToken, keyPrivate, {
        issuer: config.url,
        audience: config.url,
      })
      log.info(`data is: ${JSON.stringify(data)}`)
    } catch (err) {
      log.error(`claims() jose.decodeJwt error: ${err}`)
    }
    if (data && data.payload && data.payload.sub) {
      payload = data.payload
    }
  }
  return payload
}

const sign = async (jwtObj, exp) => {
  //const jwtStr = JSON.stringify(jwtObj)
  log.info(`creating token with ${JSON.stringify(jwtObj)}`)
  const alg = 'EdDSA'
  const jwt = await new jose.SignJWT(jwtObj)
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setIssuer(config.url)
    .setAudience(config.url)
    .setExpirationTime(exp)
    .sign(keyPrivate)
  return jwt
}

export const create = async (jwtType, value) => {
  log.info(`creating ${jwtType} jwt for ${value}`)
  const exp = expTime(jwtType)
  const jwtObj = {
    sub: value.toString(),
  }
  const jwt = await sign(jwtObj, exp)
  log.info(`Signed jwt is: ${jwt}`)
  return jwt
}
*/
