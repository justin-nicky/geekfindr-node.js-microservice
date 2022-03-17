import express, { Request, Response } from 'express'
import {
  protectRoute,
  validateRequest,
  BadRequestError,
  ForbiddenOperationError,
} from '@geekfindr/common'
import { param } from 'express-validator'

import { Conversation } from '../models/conversation'
import { Message } from '../models/message'

const router = express.Router()

const requestValidatorMiddlewares = [
  param('conversationId')
    .notEmpty()
    .withMessage('Conversation id is required')
    .bail()
    .isMongoId()
    .withMessage('Invalid conversation id'),
  validateRequest,
]

router.get(
  '/api/v1/chats/conversations/:conversationId/messages',
  protectRoute,
  requestValidatorMiddlewares,
  async (req: Request, res: Response) => {
    const conversationQuery = Conversation.findById(req.params.conversationId)
    const messagesQuery = Message.find({
      conversationId: req.params.conversationId,
    }).limit(50)

    const [messages, conversation] = await Promise.all([
      messagesQuery,
      conversationQuery,
    ])

    if (!conversation) {
      throw new BadRequestError('Invalid conversation id')
    }

    const isParticipant = conversation.participants.some(
      (participant) => String(participant) === String(req.user!.id)
    )
    if (!isParticipant) {
      throw new ForbiddenOperationError()
    }

    res.send(messages)
  }
)

export { router as getMessagesRouter }
