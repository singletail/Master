import expo from '../../lib/expo.js'
import Magic from '../../models/magic.mjs'
import User from '../../models/user.mjs'
import * as jwt from '../../modules/jwt.mjs'
import { sendLink, verifySMTP } from '../smtp.mjs'
import logger from '../../config/logger.mjs'

const log = logger.child({ src: import.meta.url })

export const email = async (id, email) => {
  const magicRecord = await getMagicRecord(email)
  const token = await generateToken(magicRecord.uuid)
  magicRecord.token = token
  await magicRecord.save()
  const result = await sendLink(email, `https://n0.tel/auth?email=${email}&token=${token}`)
  log.info(`email sent: ${JSON.stringify(result)}`)
  expo.res(id, 'auth', 'email', 'sent')
}


export const login = async (email, ip, origin) => {
  const magicRecord = await getMagicRecord(email)
  const token = await generateToken(magicRecord.uuid)
  updateMagicRecord(magicRecord, token, ip)
  return await sendLink(email, `${origin}/token?email=${email}&token=${token}`)
}

const getMagicRecord = async (email) => {
  let magicRecord = await Magic.findOne({ email: email })
  if (!magicRecord) {
    magicRecord = await createMagicRecord(email)
  }
  return magicRecord
}

const createMagicRecord = async (email, ip) => {
  const magicRecord = await new Magic({
    email: email,
  })
  await magicRecord.save()
  return magicRecord
}

const updateMagicRecord = async (magicRecord, token, ip) => {
  magicRecord.token = token
  magicRecord.ip = ip
  magicRecord.numSent += 1
  magicRecord.last = Date.now()
  await magicRecord.save()
}

const generateToken = async (uuid) => {
  // magic token uuid
  const magicToken = await jwt.jwtSign(uuid, 'auth', 'https://dev.n0.tel')
  return magicToken
}

const createUserRecord = async (magicRecord) => {
  const userRecord = await new User({
    username: magicRecord.email,
    email: magicRecord.email,
    displayName: magicRecord.email,
  })
  userRecord.authentication.push('magicRecord.uuid')
  await userRecord.save()
  return userRecord
}

export const checkMagicLink = async (email, token, origin) => {
  const magicTokenPayload = await jwt.checkAndVerifyToken(token, origin)
  const magicToken = magicTokenPayload.sub
  if (!magicToken) return { code: 403, message: 'Invalid token.' }
  const magicRecord = await Magic.findOne({ email: email, token: token })
  if (!magicRecord) return { code: 403, message: 'Invalid token.' }
  let user = await User.findOne({ uuid: magicRecord.userid })
  if (!user) user = await createUserRecord(magicRecord)
  if (user.level == 0) user.level = 1
  user.isAuthenticated = true
  await user.save()
  magicRecord.userid = user.uuid
  await magicRecord.save()
  const userToken = await jwt.jwtSign(user.uuid, 'user', origin)
  const authToken = await jwt.jwtSign(user.uuid, 'auth', origin)
  return {
    code: 200,
    message: 'OK',
    uuid: user.uuid,
    email: user.email,
    level: user.level,
    username: user.username,
    displayName: user.displayName,
    userToken: userToken,
    authToken: authToken,
  }
}
