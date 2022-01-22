import mongoose from 'mongoose'

import { Password } from '../utils/password'

// An interface that describes the properties
// that are requried to create a new User
interface UserAttrs {
  email: string
  username: string
  password?: string
  avatar?: string
}

// An interface that describes the properties
// that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc
}

// An interface that describes the properties
// that a User Document has
interface UserDoc extends mongoose.Document {
  email: string
  username: string
  password?: string
  avatar?: string
  createdAt: string
  updatedAt: string
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    avatar: {
      type: String,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password
        delete ret.__v
        ret.id = ret._id
        delete ret._id
      },
    },
    timestamps: true,
  }
)

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await Password.hashPassword(this.password)
  }
  next()
})

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs)
}
const User = mongoose.model<UserDoc, UserModel>('User', userSchema)

export { User }
