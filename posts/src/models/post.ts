import mongoose, { Schema } from 'mongoose'

export enum MediaTypes {
  image = 'image',
  video = 'video',
}

interface Like {
  owner: string
  _id?: string
}

interface TeamJoinRequest {
  owner: string
  _id?: string
}

// An interface that describes the properties
// that are requried to create a new Post
interface PostAttrs {
  isProject: boolean
  projectName?: string
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
  projectName?: string
  mediaType: MediaTypes
  mediaURL: string
  description: string
  likeCount: number
  likes: Like[]
  commentCount: number
  comments: object[]
  teamJoinRequestCount: number
  teamJoinRequests: TeamJoinRequest[]
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

const teamJoinRequestSchema = new mongoose.Schema({
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
    projectName: {
      type: String,
      required: false,
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
    teamJoinRequestCount: {
      type: Number,
      default: 0,
    },
    teamJoinRequests: {
      type: [teamJoinRequestSchema],
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
