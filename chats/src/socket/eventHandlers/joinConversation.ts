import { Websocket } from '../webSocket'
import { Socket } from 'socket.io'
import mongoose from 'mongoose'

import { Conversation } from '../../models/conversation'
import { getCurrentUser, userJoin } from '../users'

export const joinConversationHandler = (io: Websocket, socket: Socket) => {
  const joinConversation = async ({
    conversationId,
  }: {
    conversationId: string
  }) => {
    if (conversationId) {
      try {
        const conversation = await Conversation.findById(conversationId)
        if (!conversation) {
          throw new Error('Invalid conversation id')
        }

        const isUserAuthorized = conversation.participants.some(
          (participant) => String(participant) === String(socket.data.user.id)
        )
        if (!isUserAuthorized) {
          throw new Error('User is not authorized to join this conversation')
        }

        const user = userJoin(
          socket.data.user.id,
          socket.id,
          new mongoose.Types.ObjectId(conversationId)
        )
      } catch (error) {
        console.error(error)
      }
    }
  }
  socket.on('join_conversation', joinConversation)
}
