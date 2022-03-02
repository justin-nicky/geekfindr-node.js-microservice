import mongoose from 'mongoose'

// An interface that describes the properties
// that are requried to create a new Message
interface MessageAttrs {
  senderId: mongoose.Types.ObjectId
  message: string
  conversationId: mongoose.Types.ObjectId
}

// An interface that describes the properties
// that a Message Model has
interface MessageModel extends mongoose.Model<MessageDoc> {
  build(attrs: MessageAttrs): MessageDoc
}

// An interface that describes the properties
// that a Message Document has
export interface MessageDoc extends mongoose.Document {
  senderId: mongoose.Types.ObjectId
  message: string
  conversationId: mongoose.Types.ObjectId
}

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    conversationId: {
      type: mongoose.Types.ObjectId,
      required: true,
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

messageSchema.statics.build = (attrs: MessageAttrs) => {
  return new Message(attrs)
}
const Message = mongoose.model<MessageDoc, MessageModel>(
  'Message',
  messageSchema
)

export { Message }
