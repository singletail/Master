const Geo = require('../models/geo.js');
const axios = require('axios');
const log = require('../config/logger.js')(module);

let debug = false;

const geo_lookup = async (ip) => {
  const geo_uri = `http://ip-api.com/json/${ip}?fields=50593791`;
  let reply = [];
  try {
    const response = await axios.get(geo_uri);
    if (response.statusText != 'OK') {
      log.warn('Bad Geo Response');
    } else {
      reply = response['data'];
    }
  } catch (error) {
    log.warn('Bad Geo Request: ' + error.message);
  }
  return reply;
};

const generate_summary = (geo) => {
  let note = '';
  if (geo.proxy) {
    note = ' (VPN)';
  } else if (geo.hosting) {
    note = ' (Data Center)';
  } else if (geo.mobile) {
    note = ' (Mobile)';
  }
  let summary = `${geo.reverse}${note} - ${geo.city}, ${geo.region}, ${geo.countryCode} - ${geo.lat}, ${geo.lon}`;
  return summary;
};

const geolocation = async (req, res, next) => {
  let geo = await Geo.findOne({ ip: req.ip });
  if (!geo) {
    if (debug) {
      log.info('No entry found -- New Geo Lookup for ' + req.ip);
    }
    let geodata = await geo_lookup(req.ip);
    if (geodata.status != 'success') {
      log.warn('Bad Geo Response for ' + req.ip);
    } else {
      if (debug) {
        log.info('Got geodata: ' + JSON.stringify(geodata));
      }
      geo = new Geo();
      geo.ip = req.ip;
      for (let key in geodata) {
        geo[key] = geodata[key];
      }
      geo.footer = generate_summary(geodata);
      if (debug) {
        log.info('geo.footer set to: ' + geo.footer);
      }
    }
  }
  if (geo) {
    if (debug) {
      log.info('At end. footer is now ' + geo.footer.toString());
    }
    req.userData.geo.footer = geo.footer ?? '';
    req.userData.geo.offset = geo.offset ?? 0;
    geo.last = Date.now();
    geo.save();
  }
  next();
};

module.exports = geolocation;
