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
          email: 1,
          username: 1,
          avatar: 1,
          bio: 1,
          organizations: 1,
          followersCount: 1,
          followingCount: 1,
          experience: 1,
          education: 1,
          works: 1,
          skills: 1,
          socials: 1,
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
