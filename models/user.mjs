import { mongoose } from 'mongoose'
import * as uuid from 'uuid'

const { Schema } = mongoose

const UserSchema = new Schema({
  uuid: {
    type: String,
    default: function genUUID() {
      return uuid.v4()
    },
    index: true,
    unique: true,
  },
  created: { type: Date, default: Date.now },
  last: { type: Date, default: Date.now },
  level: { type: Number, min: 0, max: 10, default: 0 },
  username: { type: String, unique: true, index: true, default: '' },
  displayName: { type: String, default: '' },
  email: { type: String, unique: true, default: '' },
  hash: { type: String, default: '' },
  numFails: { type: Number, default: 0 },
  numRequests: { type: Number, default: 0 },
  numErrors: { type: Number, default: 0 },
  isLocked: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  isApproved: { type: Boolean, default: false },
  isBanned: { type: Boolean, default: false },
  authentication: [{ type: String }],
  trackers: [{ type: String }],
})

const User = mongoose.model('User', UserSchema)
export default User
