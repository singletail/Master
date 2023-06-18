const mongoose = require('mongoose');
const uuid = require('uuid');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  uuid: {
    type: String,
    default: function genUUID() {
      return uuid.v4();
    },
    index: true,
    unique: true,
  },
  created: { type: Date, default: Date.now },
  last: { type: Date, default: Date.now },
  level: { type: Number, min: 0, max: 10, default: 0 },
  userName: { type: String, default: '' },
  displayName: { type: String, default: '' },
  email: { type: String, default: '' },
  numRequests: { type: Number, default: 0 },
  numErrors: { type: Number, default: 0 },
  isAdmin: { type: Boolean, default: false },
  isApproved: { type: Boolean, default: false },
  isBanned: { type: Boolean, default: false },
  authentication: [{ type: String }],
  trackers: [{ type: String }],
});

let User = mongoose.model('User', UserSchema);
module.exports = User;
