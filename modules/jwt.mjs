import * as fs from 'node:fs'
import * as jose from 'jose'
import pseudo from '../lib/crypto.js'
import config from '../config/config.mjs'
//import logger from '../config/logger.mjs'
//const log = logger.child({ src: import.meta.url })

let keyPrivate
const jwtPrivate = fs.readFileSync(config.jwt.private, 'utf8')
const getKey = async () =>
    (keyPrivate = await jose.importPKCS8(jwtPrivate, 'EdDSA'))
getKey()

export const areClaimsValid = (jwt) => {
    let jwtDateValid = false
    const claims = jose.decodeJwt(jwt)
    const nowCheck = now()
    if (claims.exp && claims.exp > nowCheck) jwtDateValid = true
    return jwtDateValid
}

export const decodeToken = (jwt) => {
    const claims = jose.decodeJwt(jwt)
    return claims
}

export const verifyToken = async (jwt, origin = 'https://n0.tel') => {
    let issuer = 'https://n0.tel'
    if (origin === 'http://dev.n0.tel') issuer = origin
    const { payload } = await jose.jwtVerify(jwt, keyPrivate, {
        issuer: issuer,
        audience: issuer,
    })
    return payload
}

const encodeCnf = (value) => {
    const valind = { auth: 0, user: 2, magic: 5, tracker: 7, admin: 9 }
    return pseudo.create(valind[value])
}

const decodeCnf = (cnf) => {
    const valstr = {
        0: 'auth',
        2: 'user',
        5: 'magic',
        7: 'tracker',
        9: 'admin',
    }
    return valstr[pseudo.read(cnf)]
}

export const jwtSign = async (vStr, vTyp = 'auth', iss = 'https://n0.tel') => {
    const exp = expTime(vTyp)
    const cnf = encodeCnf(vTyp)
    const jwt = await new jose.SignJWT({ sub: vStr, cnf: cnf })
        .setProtectedHeader({ alg: 'EdDSA' })
        .setIssuedAt()
        .setIssuer(iss)
        .setAudience(iss)
        .setExpirationTime(exp)
        .sign(keyPrivate)
    return jwt
}

export const checkAndVerifyToken = async (token, origin = 'https://n0.tel') => {
    if (!areClaimsValid(token)) return null
    const payload = await verifyToken(token, origin)
    payload.type = decodeCnf(payload.cnf)
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
