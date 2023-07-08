import * as uuid from 'uuid'
import { mongoose } from 'mongoose'

const trackerSchema = new mongoose.Schema(
  {
    uuid: {
      type: String,
      default: function genUUID() {
        return uuid.v4()
      },
      index: true,
      unique: true,
    },
    numRequests: { type: Number, default: 1 },
    numErrors: { type: Number, default: 0 },
    ip: [{ type: String }],
    fingerprint: [{ type: String }],
    userid: { type: String },
    isBanned: { type: Boolean, default: false },
    last: { type: Date, default: Date.now },
  },
)

const Tracker = mongoose.model('Tracker', trackerSchema)
export default Tracker
