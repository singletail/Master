import { mongoose } from 'mongoose'
//import * as uuid from 'uuid'

const { Schema } = mongoose

const PostSchema = new Schema({
    url: {
        type: String, default: '',
        required: true,
        unique: true,
    },
    title: {
        type: String, default: '',
        required: true,
    },
    description: {
      type: String,
      required: [true, 'A Blog Post must have a description'],
    },
    tags: [String],
    readCount: {
      type: Number,
      default: 0,
    },
    author: {
      type: String,
      required: true,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    state: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    body: {
      type: String,
      required: [true, 'A Blog Post must contain a body'],
    },
    readTime: {
      type: String,
    },
  },
  { timestamps: true },
)

const Post = mongoose.model('Post', PostSchema)
export default Post
