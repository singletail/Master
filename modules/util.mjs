import logger from '../config/logger.mjs'

const log = logger.child({ src: import.meta.url })

const units = {
    s: 1,
    m: 60,
    h: 3600,
    d: 86400,
}

export const now = async () => {
  return new Date(Date.now())
}

export const seconds = async (num, unit) => {
    return num * units[unit]
}

const durationByType = {}
durationByType.auth = seconds(1, 'h')
durationByType.user = seconds(1, 'd')
durationByType.tracker = seconds(400, 'd')

export const cookieExpByType = async (type) => {
    const duration = await durationByType[type]
    return new Date(Date.now() + (duration * 1000))
}

export const jwtExpByType = async (type) => {
  const duration = await durationByType[type]
  const exp = new Date(Date.now() + duration * 1000)
  return Math.floor(exp.getTime() / 1000)
}