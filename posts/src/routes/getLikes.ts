import express, { Request, Response } from 'express'
import {
  BadRequestError,
  protectRoute,
  validateRequest,
} from '@geekfindr/common'
import { param } from 'express-validator'

import { Post } from '../models/post'

const router = express.Router()

const requestBodyValiatiorMiddlewares = [
  param('id').isMongoId().withMessage('Invalid id.'),
  validateRequest,
]

router.get(
  '/api/v1/posts/:id/likes',
  protectRoute,
  requestBodyValiatiorMiddlewares,
  async (req: Request, res: Response) => {
    const id = req.params.id
    const post = await Post.findById(id)
      .select('-likes._id')
      .populate('likes.owner', 'username avatar')
    if (!post) {
      throw new BadRequestError('Invalid id.')
    }
    res.json(post.likes)
  }
)

export { router as getLikesRouter }
