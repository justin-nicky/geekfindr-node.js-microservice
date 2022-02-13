import express, { Request, Response } from 'express'
import {
  BadRequestError,
  protectRoute,
  validateRequest,
} from '@geekfindr/common'
import { query } from 'express-validator'
import mongoose from 'mongoose'

import { Post } from '../models/post'
import { User } from '../models/user'

const router = express.Router()

const requestBodyValiatiorMiddlewares = [
  query('limit')
    .notEmpty()
    .withMessage('Limit is required.')
    .bail()
    .isInt({ gt: 0, lt: 25 })
    .withMessage('Limit must be a positive integer less than 25.'),
  query('lastId').optional().isMongoId().withMessage('Invalid lastId.'),
  validateRequest,
]

router.get(
  '/api/v1/posts/my-feed',
  protectRoute,
  requestBodyValiatiorMiddlewares,
  async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string)
    const lastId = req.query.lastId as string | undefined
    const user = await User.findById(req.user.id)
    let postIds: string[] = []
    // handling the situation where last id is provided
    if (lastId !== undefined) {
      if (!user?.feed?.includes(lastId)) {
        throw new BadRequestError('Invalid lastId.')
      }
      postIds = user.feed.slice(user.feed.indexOf(lastId) + 1, limit)
    }
    // handling the situation where last id is not provided
    else {
      postIds = user?.feed?.slice(0, limit) ?? []
    }
    console.log(postIds)
    const postMongooseIds =
      postIds.map((post) => new mongoose.Types.ObjectId(post)) ?? []
    const feed = await Post.find({
      _id: { $in: postMongooseIds },
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .select('-likes._id -comments._id -teamJoinRequests._id')
      .populate('owner', 'username avatar')
    res.json(feed)
  }
)

export { router as getMyFeedRouter }
