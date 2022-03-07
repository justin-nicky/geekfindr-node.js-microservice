import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import {
  protectRoute,
  validateRequest,
  BadRequestError,
  ForbiddenOperationError,
} from '@geekfindr/common'
import mongoose from 'mongoose'

import { Conversation } from '../models/conversation'
import { User } from '../models/user'

const router = express.Router()

const ObjectId = mongoose.Types.ObjectId

const requestValidatorMiddlewares = [
  body('memberId')
    .notEmpty()
    .withMessage('Member id is required')
    .bail()
    .isMongoId()
    .withMessage('Invalid user id'),
  validateRequest,
]

router.patch(
  '/api/v1/chats/conversations/:conversationId/participants',
  protectRoute,
  requestValidatorMiddlewares,
  async (req: Request, res: Response) => {
    const {
      memberId,
    }: {
      memberId: string
      roomName: string | undefined
    } = req.body
    const user = req.user

    const conversationQuery = Conversation.findOne({
      _id: req.params.conversationId,
      isRoom: true,
    })
    const memberQuery = User.findById(memberId)

    const [conversation, member] = await Promise.all([
      conversationQuery,
      memberQuery,
    ])

    if (!member) {
      throw new BadRequestError('Invalid user id')
    }

    if (!conversation) {
      throw new BadRequestError('Conversation not found.')
    }

    const isCurrentUserAuthorized = conversation.participants.some(
      (participant) => String(participant) === String(user.id)
    )
    if (!isCurrentUserAuthorized) {
      throw new ForbiddenOperationError()
    }

    const isAlreadyAParticipant = conversation.participants.some(
      (participant) => String(participant) === String(memberId)
    )
    if (isAlreadyAParticipant) {
      throw new BadRequestError('User is already a participant.')
    }

    conversation.participants.push(new ObjectId(memberId))
    await conversation.save()

    res.json(conversation)
  }
)

export { router as addMemberRouter }
