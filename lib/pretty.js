import * as uuid from 'uuid'
import * as cookie from 'cookie'
import { decodeToken, verifyToken } from '../modules/jwt.mjs'
import logger from '../config/logger.mjs'
import * as jose from 'jose'

const log = logger.child({ src: import.meta.url })

const c = {
    ['r']: '<span class="cRed">',
    ['o']: '<span class="cOrange">',
    ['y']: '<span class="cYellow">',
    ['g']: '<span class="cGreen">',
    ['b']: '<span class="cBlue">',
    ['v']: '<span class="cViolet">',
    ['p']: '<span class="cPink">',
    ['c']: '<span class="cCyan">',
    ['w']: '<span class="cWhite">',
    ['x']: '</span>',
}

const pretty = {

    req: (req, delim='<br />') => {
        let msgReq = ''
        const r = {
            'url': req.url,
            'method': req.method,
            'path': req.path,
            'statusCode': req.statusCode,
            'statusMessage': req.statusMessage,
            'originalUrl': req.originalUrl,
            'baseUrl': req.baseUrl,
            'params': req.params,
            'query': req.query,
            'body': req.body,
            'secret': req.secret,
            'session': req.session,
            'userdata': req.userdata,
        }
        for (const [key, value] of Object.entries(r)) {
            if (value === undefined) {
                // msgReq += `${c.w}${key}${c.x}: ${c.r}undefined${c.x}, `
            } else if (value === null) {
                msgReq += `${c.w}${key}${c.x}: `
                msgReq += `${c.o}null${c.x}${delim}`
            } else if (typeof value === 'object') {
                msgReq += `${c.c}${key}: {${c.x} `
                const child = value
                const oLen = Object.keys(child).length
                if (oLen === 0) {
                    msgReq += `${c.o}empty${c.x} `
                } else {
                    for (const [key, value] of Object.entries(child)) {
                        msgReq += `${c.c}${key}: ${c.x}`
                    if (typeof value === 'undefined') {
                        msgReq += `${c.r}undefined: ${value}${c.x}, `
                    } else if (value === null) {
                        msgReq += `${c.o}null${c.x}, `
                    } else if (typeof value === 'object') {
                        msgReq += `${c.y}[${JSON.stringify(value)}]${c.x}, `
                    } else {
                        msgReq += ` ${c.g}${value}${c.x}, `
                    }
                }
            }
            msgReq += `${c.c}}${c.x}${delim}`
            } else {
                msgReq += `${c.w}${key}${c.x}: ${c.g}${value}${c.x}${delim}`
            }
        }
        return msgReq
    },

    headers: (req, delimH='<br />') => {
        let msgHeaders = ''
        const h = {
            'host': req.headers.host,
            'connection': req.headers.connection,
            'sec-ch-ua': req.headers['sec-ch-ua'],
            'sec-ch-ua-mobile': req.headers['sec-ch-ua-mobile'],
            'sec-ch-ua-platform': req.headers['sec-ch-ua-platform'],
            'x-forwarded-for': req.headers['x-forwarded-for'],
            'x-forwarded-proto': req.headers['x-forwarded-proto'],
            'x-forwarded-host': req.headers['x-forwarded-host'],
            'x-forwarded-port': req.headers['x-forwarded-port'],
            'x-real-ip': req.headers['x-real-ip'],
            'x-real-port': req.headers['x-real-port'],
            'x-real-scheme': req.headers['x-real-scheme'],
            'x-real-url': req.headers['x-real-url'],
            'x-real-path': req.headers['x-real-path'],
            'x-real-query': req.headers['x-real-query'],
            'x-real-params': req.headers['x-real-params'],
            'x-real-body': req.headers['x-real-body'],
            'x-real-userdata': req.headers['x-real-userdata'],
            'user-agent': req.headers['user-agent'],
        }
        for (const [key, value] of Object.entries(h)) {
            if (value === undefined) {
                // msgHeaders += `${c.w}${key}${c.x}: ${c.r}undefined${c.x}, `
            } else if (value === null) {
                msgHeaders += `${c.v}${key}${c.x}: `
                msgHeaders += `${c.o}null${c.x}${delimH}`
            } else if (typeof value === 'object') {
                msgHeaders += `${c.c}${key}: {${c.x} `
                const child = value
                const oLen = Object.keys(child).length
                if (oLen === 0) {
                    msgHeaders += `${c.o}empty${c.x} `
                } else {
                    for (const [key, value] of Object.entries(child)) {
                    msgHeaders += `${c.c}${key}: ${c.x}`
                    if (typeof value === 'undefined') {
                        msgHeaders += `${c.r}undefined: ${value}${c.x}, `
                    } else if (value === null) {
                        msgHeaders += `${c.o}null${c.x}, `
                    } else if (typeof value === 'object') {
                        msgHeaders += `${c.y}[${JSON.stringify(value)}]${c.x}, `
                    } else {
                        msgHeaders += ` ${c.g}${value}${c.x}, `
                    }
                }
            }
            msgHeaders += `${c.c}}${c.x}${delimH}`
            } else {
                msgHeaders += `${c.v}${key}${c.x}: ${c.g}${value}${c.x}${delimH}`
            }
        }
        return msgHeaders
    },

    cookie: async (cook, delimC = '<br />') => {
        //log.info(`checking cookie: ${cook}`)
        let str = ''
        const parsed = cookie.parse(cook)
        if (Object.keys(parsed).length > 0) {
            for (const [key, value] of Object.entries(parsed)) {
                str += `${c.p}${key}${c.x}: ${c.c}${value}${c.x}`
            }
            str += `${delimC}`
            log.info(`returning cookie keypairs: ${str}`)
            return str
        } else if (uuid.validate(cook) === true) {
            log.info(`returning uuid: ${cook}`)
            return `${c.p}uuid${c.x}: ${c.c}${cook}${c.x}${delimC}`
        } else {
            const jwtClaims = decodeToken(cook)
            let ok, sub, iss, aud, exp, iat, jti
            if (jwtClaims) {
                ok = `${c.r}Unverified JWT: ${c.x}`
                if ('sub' in jwtClaims) {
                    sub = jwtClaims.sub
                }
                if ('iss' in jwtClaims) {
                    iss = jwtClaims.iss
                }
                if ('aud' in jwtClaims) {
                    aud = jwtClaims.aud
                }
                if ('exp' in jwtClaims) {
                    exp = jwtClaims.exp
                }
                if ('iat' in jwtClaims) {
                    iat = jwtClaims.iat
                }
            
                const payload = await verifyToken(cook)
                if (payload) {
                    ok = `${c.g}Verified JWT: ${c.x}`
                }
                const jwtStr = `${ok} sub: ${sub} iss: ${iss} aud: ${aud} exp: ${exp} iat: ${iat}${delimC}`
                return jwtStr
            } else {
                return `${c.r}Unknown Cookie${c.x}: ${cook}${delimC}`
            }
        }
    },
}

export default pretty