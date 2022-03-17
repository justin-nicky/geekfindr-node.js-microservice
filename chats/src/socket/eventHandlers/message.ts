import { Websocket } from '../webSocket'
import { Socket } from 'socket.io'
import mongoose from 'mongoose'

import { Message } from '../../models/message'
import { Conversation } from '../../models/conversation'
import { getCurrentUser } from '../users'

export const messageHandler = (io: Websocket, socket: Socket) => {
  const message = async ({
    message,
    conversationId,
  }: {
    message: string
    conversationId: string
  }) => {
    if (message && conversationId) {
      try {
        const time = new Date().toISOString()
        const user = getCurrentUser(socket.id)
        if (!user) {
          return
        }

        io.to(conversationId).emit('message', {
          message,
          userId: user.id,
          time,
          conversationId,
        })

        let newMessage = await Message.build({
          senderId: user.id,
          conversationId: new mongoose.Types.ObjectId(conversationId),
          message,
        }).save()

        let copyOfNewMessage = { ...newMessage, id: newMessage._id }
        copyOfNewMessage._id = undefined
        copyOfNewMessage.__v = undefined

        Conversation.updateOne(
          { _id: conversationId },
          {
            $push: {
              messages: newMessage._id,
            },
            $set: { lastMessage: copyOfNewMessage },
          }
        ).exec()
      } catch (error) {
        console.error(error)
      }
    }
  }
  socket.on('message', message)
}
