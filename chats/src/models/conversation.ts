import mongoose from 'mongoose'

import { MessageDoc } from './message'

// An interface that describes the properties
// that are requried to create a new Conversation
interface ConversationAttrs {
  participants: mongoose.Types.ObjectId[]
  messages?: mongoose.Types.ObjectId[]
  isRoom: boolean
  roomName?: string
  lastMessage?: MessageDoc
}

// An interface that describes the properties
// that a Conversation Model has
interface ConversationModel extends mongoose.Model<ConversationDoc> {
  build(attrs: ConversationAttrs): ConversationDoc
}

// An interface that describes the properties
// that a Conversation Document has
export interface ConversationDoc extends mongoose.Document {
  participants: mongoose.Types.ObjectId[]
  messages?: mongoose.Types.ObjectId[]
  isRoom: boolean
  roomName?: string
  lastMessage?: MessageDoc
}

const conversationSchema = new mongoose.Schema(
  {
    participants: {
      type: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
      required: true,
    },
    messages: {
      type: [mongoose.Types.ObjectId],
      ref: 'Message',
      required: true,
      default: [],
    },
    isRoom: {
      type: Boolean,
      required: true,
    },
    roomName: {
      type: String,
      required: false,
    },
    lastMessage: {
      type: Object,
      default: {},
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

conversationSchema.statics.build = (attrs: ConversationAttrs) => {
  return new Conversation(attrs)
}
const Conversation = mongoose.model<ConversationDoc, ConversationModel>(
  'Conversation',
  conversationSchema
)

export { Conversation }
