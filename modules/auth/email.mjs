import Magic from '../../models/magic.mjs'
import User from '../../models/user.mjs'
import * as jwt from '../../modules/jwt.mjs'
import { sendLink, verifySMTP } from '../smtp.mjs'
import logger from '../../config/logger.mjs'

const log = logger.child({ src: import.meta.url })

export const login = async (email, ip, origin) => {
  let magicRecord = await getMagicRecord(email)
  let token = await generateToken(magicRecord.uuid)
  updateMagicRecord(magicRecord, token, ip)
  return await sendLink(
    email,
    `https://${origin}/api/auth/token?email=${email}&token=${token}`
  )
}

const getMagicRecord = async (email) => {
  let magicRecord = await Magic.findOne({ email: email })
  if (!magicRecord) {
    magicRecord = await createMagicRecord(email)
  }
  return magicRecord
}

const createMagicRecord = async (email, ip) => {
  let magicRecord = await new Magic({
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
  let userRecord = await new User({
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
  let magicRecord = await Magic.findOne({ email: email, token: token })
  if (!magicRecord) return { code: 403, message: 'Invalid token.' }
  let user = await User.findOne({ uuid: magicRecord.userid })
  if (!user) user = await createUserRecord(magicRecord)
  magicRecord.userid = user.uuid
  await magicRecord.save()
  const userToken = await jwt.jwtSign(user.uuid, 'user', origin)
  const authToken = await jwt.jwtSign(user.uuid, 'auth', origin)
  return {
    code: 200,
    message: 'OK',
    uuid: user.uuid,
    username: user.username,
    displayName: user.displayName,
    userToken: userToken,
    authToken: authToken,
  }
}
