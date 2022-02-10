import mongoose, { Schema } from 'mongoose'

export enum MediaTypes {
  image = 'image',
  video = 'video',
}

// An interface that describes the properties
// that are requried to create a new Post
interface PostAttrs {
  isProject: boolean
  mediaType: MediaTypes
  mediaURL: string
  description: string
  isOrganization: boolean
  owner: string
  isDeleted?: boolean
}

// An interface that describes the properties
// that a Post Model has
interface PostModel extends mongoose.Model<PostDoc> {
  build(attrs: PostAttrs): PostDoc
}

// An interface that describes the properties
// that a Post Document has
export interface PostDoc extends mongoose.Document {
  isProject: boolean
  mediaType: MediaTypes
  mediaURL: string
  description: string
  likeCount: number
  likes: string[]
  commentCount: number
  comments: object[]
  teamJoinRequests?: object[]
  isOrganization: boolean
  owner: string
  isDeleted: boolean
}

const commentSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
})

const likeSchema = new mongoose.Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
})

const postSchema = new mongoose.Schema(
  {
    mediaType: {
      type: String,
      required: true,
      enum: MediaTypes,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    isProject: {
      type: Boolean,
      required: true,
      default: false,
    },
    mediaURL: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    likeCount: {
      type: Number,
      required: true,
      default: 0,
    },
    likes: {
      type: [likeSchema],
      default: [],
      required: true,
    },
    commentCount: {
      type: Number,
      required: true,
      default: 0,
    },
    comments: {
      type: [commentSchema],
      default: [],
      required: true,
    },
    teamJoinRequests: {
      type: [Object],
      default: [],
    },
    isOrganization: {
      type: Boolean,
      required: true,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v
        ret.id = ret._id
        delete ret._id
        delete ret.isDeleted
      },
    },
    timestamps: true,
  }
)

postSchema.statics.build = (attrs: PostAttrs) => {
  return new Post(attrs)
}
const Post = mongoose.model<PostDoc, PostModel>('Post', postSchema)

export { Post }
