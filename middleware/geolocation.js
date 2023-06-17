const Geo = require('../models/geo.js');
const axios = require('axios');
const log = require('../config/logger.js');

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
    log.warn('Bad Geo Request');
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
  let returnString = '';
  let offset = 0;
  let geo = await Geo.findOne({ ip: req.real_ip });
  if (!geo) {
    let geodata = await geo_lookup(req.real_ip);
    if (geodata.status == 'success') {
      let geoEntry = new Geo();
      geoEntry.ip = req.real_ip;
      geoEntry.country = geodata.country;
      geoEntry.countryCode = geodata.countryCode;
      geoEntry.region = geodata.region;
      geoEntry.regionName = geodata.regionName;
      geoEntry.city = geodata.city;
      geoEntry.zip = geodata.zip;
      geoEntry.lat = geodata.lat;
      geoEntry.lon = geodata.lon;
      geoEntry.timezone = geodata.timezone;
      geoEntry.offset = geodata.offset;
      geoEntry.isp = geodata.isp;
      geoEntry.org = geodata.org;
      geoEntry.as = geodata.as;
      geoEntry.reverse = geodata.reverse;
      geoEntry.mobile = geodata.mobile;
      geoEntry.proxy = geodata.proxy;
      geoEntry.hosting = geodata.hosting;
      returnString = generate_summary(geodata);
      geoEntry.summary = returnString;
      geoEntry.save();
      if (geodata.offset) {
        offset = Number(geodata.offset);
      }
    }
  } else {
    returnString = geo.summary;
    geo.last = Date.now();
    geo.save();
    if (geo.offset) {
      offset = Number(geo.offset);
    }
  }
  if (!offset) {
    offset = 0;
  }
  req.geo = returnString;
  req.geo_offset = offset;
  next();
};

module.exports = geolocation;
