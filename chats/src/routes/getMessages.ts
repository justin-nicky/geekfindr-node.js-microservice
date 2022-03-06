import express, { Request, Response } from 'express'
import {
  protectRoute,
  validateRequest,
  BadRequestError,
  ForbiddenOperationError,
} from '@geekfindr/common'
import { param } from 'express-validator'

import { Conversation } from '../models/conversation'

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
    const conversation = await Conversation.findById(
      req.params.conversationId
    ).populate('messages')

    if (!conversation) {
      throw new BadRequestError('Invalid conversation id')
    }

    const isParticipant = conversation.participants.some(
      (participant) => String(participant) === String(req.user!.id)
    )
    if (!isParticipant) {
      throw new ForbiddenOperationError()
    }

    res.send(conversation.messages)
  }
)

export { router as getMessagesRouter }
