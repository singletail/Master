import * as axios from 'axios'
import Geo from '../models/geo.mjs'

import log from '../config/logger.mjs'
// import * as logger from '../config/logger.mjs'

// const log = logger(import.meta.url)

const debug = false

const lookup = async (ip) => {
  const geouri = `http://ip-api.com/json/${ip}?fields=50593791`
  let reply = []
  try {
    const response = await axios.get(geouri)
    if (response.statusText !== 'OK') {
      log.warn('Bad Geo Response')
    } else {
      reply = response.data
    }
  } catch (error) {
    log.warn(`Bad Geo Request: ${error.message}`)
  }
  return reply
}

const summary = (geo) => {
  let note = ''
  if (geo.proxy) {
    note = ' (VPN)'
  } else if (geo.hosting) {
    note = ' (Data Center)'
  } else if (geo.mobile) {
    note = ' (Mobile)'
  }
  return `${geo.reverse}${note} - ${geo.city}, ${geo.region}, ${geo.countryCode} - ${geo.lat}, ${geo.lon}`
}

const geolocation = async (req, res, next) => {
  let geo = await Geo.findOne({ ip: req.ip })
  if (!geo) {
    if (debug) {
      log.info(`No entry found -- New Geo Lookup for ${req.ip}`)
    }
    const geodata = await lookup(req.ip)
    if (geodata.status !== 'success') {
      log.warn(`Bad Geo Response for ${req.ip}`)
    } else {
      if (debug) {
        log.info(`Got geodata: ${JSON.stringify(geodata)}`)
      }
      geo = new Geo()
      geo.ip = req.ip

      geodata.forEach((value, key) => {
        geo[key] = value
      })

      geo.footer = summary(geodata)
      if (debug) {
        log.info(`geo.footer set to: ${geo.footer}`)
      }
    }
  }
  if (geo) {
    if (debug) {
      log.info(`At end. footer is now ${geo.footer.toString()}`)
    }
    req.userData.geo.footer = geo.footer ?? ''
    req.userData.geo.offset = geo.offset ?? 0
    geo.last = Date.now()
    geo.save()
  }
  next()
}

export default geolocation
