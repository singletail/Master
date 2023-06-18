const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GeoSchema = new Schema({
  ip: {
    type: String,
    index: true,
    unique: true,
  },
  country: { type: String },
  countryCode: { type: String },
  region: { type: String },
  regionName: { type: String },
  city: { type: String },
  zip: { type: String },
  lat: { type: Number },
  lon: { type: Number },
  timezone: { type: String },
  offset: { type: Number, default: 0 },
  isp: { type: String },
  org: { type: String },
  as: { type: String },
  reverse: { type: String },
  mobile: { type: Boolean },
  proxy: { type: Boolean },
  hosting: { type: Boolean },
  footer: { type: String },
  created: { type: Date, default: Date.now },
  last: { type: Date, default: Date.now },
});

let Geo = mongoose.model('Geo', GeoSchema);
module.exports = Geo;
