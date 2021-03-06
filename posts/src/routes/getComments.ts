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
  '/api/v1/posts/:id/comments',
  protectRoute,
  requestBodyValiatiorMiddlewares,
  async (req: Request, res: Response) => {
    const id = req.params.id
    const post = await Post.findById(id)
      .select('-comments._id')
      .populate('comments.owner', 'username avatar')
    if (!post) {
      throw new BadRequestError('Invalid id.')
    }
    res.json(post.comments)
  }
)

export { router as getCommentsRouter }
