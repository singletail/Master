const config = require('../config');
const mongoose = require('mongoose');

const Tracker = require('../models/tracker.js');
const Geo = require('../models/geo.js');
const Ban = require('../models/ban.js');
const User = require('../models/user.js');
const Authentication = require('../models/auth.js');

async function db() {
  try {
    await mongoose.connect(config.db.uri);
  } catch (error) {
    console.log(`Mongoose Error ${error}`);
  }
}

module.exports = db;
