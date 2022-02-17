import mongoose from 'mongoose'

import { MemberTypes } from './memberTypes'

// An interface describing the project properties
interface Project {
  project: mongoose.Types.ObjectId
  role: string
}

// An interface that describes the properties
// that are requried to create a new User
interface UserAttrs {
  id?: string
  username: string
  avatar?: string
}

// An interface that describes the properties
// that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc
}

// An interface that describes the properties
// that a User Document has
export interface UserDoc extends mongoose.Document {
  username: string
  avatar?: string
  projects: Project[]
}

const projectSchema = new mongoose.Schema({
  project: {
    type: mongoose.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: MemberTypes,
  },
})

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    projects: {
      type: [projectSchema],
      default: [],
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v
        ret.id = ret._id
        delete ret._id
      },
    },
    timestamps: true,
  }
)

userSchema.statics.build = (attrs: UserAttrs) => {
  const _id = attrs.id
  delete attrs.id
  return new User({ ...attrs, _id })
}
const User = mongoose.model<UserDoc, UserModel>('User', userSchema)

export { User }
