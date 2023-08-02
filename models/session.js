import mongoose from 'mongoose'
const { Schema } = mongoose

const SessionSchema = new Schema({
    id: {
        type: String,
        index: true,
        unique: true,
    },
    userId: { type: String },
    ip: { type: String },
    userName: { type: String },
    level: { type: Number, min: 0, max: 10, default: 0 },
    displayName: { type: String, default: '' },
    email: { type: String, default: '' },
    created: { type: Date, default: Date.now },
    last: { type: Date, default: Date.now },
})

const Session = mongoose.model('Session', SessionSchema)
export default Session
