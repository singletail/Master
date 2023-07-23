/*  Cookies  */
import logger from '../config/logger.mjs'
const log = logger.child({ src: import.meta.url })

const nowDate = () => {
  return new Date()
}

const addDays = (date, days) => {
  const dateCopy = new Date(date)
  dateCopy.setDate(date.getDate() + days)
  return dateCopy
}

const addHours = (date, hours) => {
  const dateCopy = new Date(date)
  dateCopy.setHours(dateCopy.getHours() + hours)
  return dateCopy
}

const expTimeObj = (type) => {
  let date = nowDate()
  if (type == 'auth') {
    date = addHours(date, 1)
  } else if (type == 'user') {
    date = addDays(date, 30)
  } else if (type == 'tracker') {
    date = addDays(date, 400)
  }
  return date
}

const cookieExpByType = (type) => {
  return expTimeObj(type)
}

const cookieSettings = (type) => {
  let options = {
    httpOnly: true,
    secure: true,
    //sameSite: 'Strict',
    expires: cookieExpByType(type),
  }
  return options
}

export default cookieSettings
