import * as uuid from 'uuid'
import { mongoose } from 'mongoose'

const { Schema } = mongoose

const MagicSchema = new Schema({
  uuid: {
    type: String,
    default: function genUUID() {
      return uuid.v4()
    },
    index: true,
    unique: true,
  },
  userid: { type: String },
  email: { type: String },
  token: { type: String },
  ip: { type: String },
  created: { type: Date, default: Date.now },
  last: { type: Date, default: Date.now },
  numSent: { type: Number, default: 0 },
  numAuthorizations: { type: Number, default: 0 },
  numErrors: { type: Number, default: 0 },
})

const Magic = mongoose.model('Magic', MagicSchema)
export default Magic
