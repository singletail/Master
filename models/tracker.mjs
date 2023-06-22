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
    num_requests: { type: Number, default: 1 },
    num_errors: { type: Number, default: 0 },
    ip: [{ type: String }],
    fingerprint: [{ type: String }],
    userid: { type: String },
    isBanned: { type: Boolean, default: false },
  },
  { timestamps: true }
)

const Tracker = mongoose.model('Tracker', trackerSchema)
export default Tracker
