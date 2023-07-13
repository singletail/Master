import axios from 'axios'
import Geo from '../models/geo.mjs'
import logger from '../config/logger.mjs'

const log = logger.child({ src: import.meta.url })

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
    const geodata = await lookup(req.ip)
    if (geodata.status !== 'success') {
      log.warn(`Bad Geo Response for ${req.ip}`)
    } else {
      geo = new Geo()
      geo.ip = req.ip

      Object.keys(geodata).forEach((key) => {
        if (Object.prototype.hasOwnProperty.call(geodata, key)) {
          geo[key] = geodata[key]
        }
      })

      geo.footer = summary(geodata)
      if (debug) {
        log.info(`geo.footer set to: ${geo.footer}`)
      }
    }
  }
  if (geo) {
    req.userdata.geo.region = geo.region ?? ''
    req.userdata.geo.city = geo.city ?? ''
    req.userdata.geo.countryCode = geo.countryCode ?? ''
    req.userdata.geo.footer = geo.footer ?? ''
    req.userdata.geo.offset = geo.offset ?? 0
    geo.last = Date.now()
    geo.save()
  }
  log.info(`geo done ${req.userdata.geo.footer}`)
  next()
}

export default geolocation
