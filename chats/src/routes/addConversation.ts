import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import {
  protectRoute,
  validateRequest,
  BadRequestError,
} from '@geekfindr/common'
import mongoose from 'mongoose'

import { Conversation } from '../models/conversation'

const router = express.Router()

const ObjectId = mongoose.Types.ObjectId

const requestValidatorMiddlewares = [
  body('isRoom')
    .notEmpty()
    .withMessage('isRoom is required')
    .bail()
    .isBoolean()
    .withMessage('isRoom must be a boolean'),
  body('roomName')
    .optional()
    .isString()
    .withMessage('roomName must be a string')
    .custom((value, { req }) => {
      if (req.body.isRoom) {
        return value !== undefined
      }
      return true
    })
    .withMessage('Room name is required.'),
  body('participants')
    .notEmpty()
    .withMessage('Participants is required')
    .bail()
    .isArray()
    .withMessage('Participants must be an array of user ids')
    .custom((value) => {
      let isMongoIdArray = (data: any) => {
        for (let item of data) {
          if (!ObjectId.isValid(item) || String(new ObjectId(item)) !== item) {
            return false
          }
        }
        return true
      }
      // verifying that participants is an array of mongodb ids.
      return isMongoIdArray(value)
    })
    .withMessage('Invalid user ids.'),
  validateRequest,
]

router.post(
  '/api/v1/chats/conversations',
  protectRoute,
  requestValidatorMiddlewares,
  async (req: Request, res: Response) => {
    const {
      participants,
      isRoom,
      roomName,
    }: {
      participants: string[]
      isRoom: boolean
      roomName: string | undefined
    } = req.body
    const user = req.user

    if (!isRoom && participants.length > 1) {
      throw new BadRequestError(
        'Only two participants allowed for a private conversation.'
      )
    }

    let participantIds = participants.map(
      (participantId) => new ObjectId(participantId)
    )
    participantIds.push(new ObjectId(user.id))

    const existingConversation = await Conversation.findOne({
      isRoom: false,
      participants: participantIds,
    })

    if (existingConversation) {
      throw new BadRequestError('Conversation already exists.')
    }

    const conversation = await Conversation.build({
      participants: participantIds,
      isRoom,
      ...(isRoom ? { roomName } : {}),
    }).save()

    res.json(conversation)
  }
)

export { router as addConversationRouter }
