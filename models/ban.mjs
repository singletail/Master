import { mongoose } from 'mongoose'

const { Schema } = mongoose

const BanSchema = new Schema({
  ip: {
    type: String,
    index: true,
    unique: true,
  },
  reason: { type: String },
  request: { type: String },
  created: { type: Date, default: Date.now },
  last: { type: Date, default: Date.now },
  attempts: { type: Number, default: 1 },
})

const Banned = mongoose.model('Banned', BanSchema)
export default Banned
