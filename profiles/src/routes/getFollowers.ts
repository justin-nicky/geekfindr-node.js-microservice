import express, { Request, Response } from 'express'
import {
  BadRequestError,
  protectRoute,
  validateRequest,
} from '@geekfindr/common'
import { param } from 'express-validator'
import mongoose from 'mongoose'

import { Profile } from '../models/profile'

const router = express.Router()

const requestBodyValidatorMiddlewares = [
  param('id')
    .notEmpty()
    .withMessage('id is required.')
    .bail()
    .isMongoId()
    .withMessage('Invalid id.'),
  validateRequest,
]

router.get(
  '/api/v1/profiles/:id/followers',
  protectRoute,
  requestBodyValidatorMiddlewares,
  async (req: Request, res: Response) => {
    const profile = await Profile.findById(req.params.id)
    if (!profile) {
      throw new BadRequestError('Profile not found.')
    }
    const followersIds = profile?.followers?.map(
      (follower) => new mongoose.Types.ObjectId(follower)
    )
    const followers = await Profile.aggregate([
      {
        $match: { _id: { $in: followersIds } },
      },
      { $limit: 20 },
      {
        $project: {
          id: '$_id',
          username: 1,
          avatar: 1,
          role: 1,
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
    ])
    res.send(followers)
  }
)

export { router as getFollowers }
