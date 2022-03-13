import { Websocket } from '../webSocket'
import { Socket } from 'socket.io'

import { Message } from '../../models/message'
import { Conversation } from '../../models/conversation'
import { getCurrentUser } from '../users'

export const messageHandler = (io: Websocket, socket: Socket) => {
  const message = async ({ message }: { message: string }) => {
    if (message) {
      try {
        const time = new Date().toISOString()
        const user = getCurrentUser(socket.id)
        console.log(
          `User ${socket.data.user.id} sent a message to conversation ${user?.room}: ${message}`
        )
        if (!user) {
          return
        }
        io.to(String(user.room)).emit('message', {
          message,
          userId: user.id,
          time,
        })
        let newMessage = await Message.build({
          senderId: user.id,
          conversationId: user.room,
          message,
        }).save()
        console.log(newMessage)
        Conversation.updateOne(
          { _id: user.room },
          {
            $push: {
              messages: newMessage._id,
            },
          }
        ).exec()
      } catch (error) {
        console.error(error)
      }
    }
  }
  socket.on('message', message)
}
