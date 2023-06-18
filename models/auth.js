const uuid = require('uuid');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AuthSchema = new Schema({
  uuid: {
    type: String,
    default: function genUUID() {
      return uuid.v4();
    },
    index: true,
    unique: true,
  },
  userid: { type: String },
  providerToken: { type: String },
  provider: { type: String },
  providerUserName: { type: String },
  providerUserId: { type: Number },
  created: { type: Date, default: Date.now },
  last: { type: Date, default: Date.now },
  num_authorizations: { type: Number, default: 0 },
  num_errors: { type: Number, default: 0 },
  tracker: [{ type: String }],
  isBanned: { type: Boolean, default: false },
});

let Authentication = mongoose.model('Authentication', AuthSchema);
module.exports = Authentication;
