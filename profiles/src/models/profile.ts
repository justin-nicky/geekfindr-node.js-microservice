import mongoose from 'mongoose'

// An interface that describes the properties
// that are requried to create a new Profile
interface ProfileAttrs {
  id?: string
  email: string
  username: string
  avatar?: string
  bio?: string
  organizations?: string[]
  followers?: string[]
  following?: string[]
  followersCount?: number
  followingCount?: number
  experience?: string
  education?: object[]
  works?: object[]
  skills?: string[]
  socials?: object[]
  role?: string
}

// An interface that describes the properties
// that a Profile Model has
interface ProfileModel extends mongoose.Model<ProfileDoc> {
  build(attrs: ProfileAttrs): ProfileDoc
}

// An interface that describes the properties
// that a Profile Document has
export interface ProfileDoc extends mongoose.Document {
  email: string
  username: string
  avatar?: string
  bio?: string
  organizations?: string[]
  followers?: string[]
  following?: string[]
  followersCount?: number
  followingCount?: number
  experience?: string
  education?: object[]
  works?: object[]
  skills?: string[]
  socials?: object[]
  createdAt: string
  updatedAt: string
  role: string
}

const profileSchema = new mongoose.Schema(
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
    avatar: {
      type: String,
    },
    bio: {
      type: String,
      default: '',
    },
    organizations: {
      type: [String],
    },
    followers: {
      type: [String],
    },
    following: {
      type: [String],
    },
    followersCount: {
      type: Number,
      default: 0,
    },
    followingCount: {
      type: Number,
      default: 0,
    },
    experience: {
      type: String,
      default: '',
    },
    education: {
      type: [Object],
    },
    works: {
      type: [Object],
    },
    skills: {
      type: [String],
    },
    socials: {
      type: [Object],
    },
    role: {
      type: String,
      default: '',
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

profileSchema.statics.build = (attrs: ProfileAttrs) => {
  const _id = attrs.id
  delete attrs.id
  return new Profile({ ...attrs, _id })
}
const Profile = mongoose.model<ProfileDoc, ProfileModel>(
  'Profile',
  profileSchema
)

export { Profile }
