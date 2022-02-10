import express, { Request, Response } from 'express'
import { protectRoute, validateRequest } from '@geekfindr/common'
import { param } from 'express-validator'

import { Post } from '../models/post'

const router = express.Router()

const requestBodyValiatiorMiddlewares = [
  param('id').isMongoId().withMessage('Invalid id.'),
  validateRequest,
]

router.get(
  '/api/v1/posts/by-users/:id',
  protectRoute,
  requestBodyValiatiorMiddlewares,
  async (req: Request, res: Response) => {
    const id = req.params.id
    const posts = await Post.find({
      owner: id,
      isDeleted: false,
    })
      .select('-comments -likes -teamJoinRequests')
      .populate('owner', 'username avatar')
      .sort({ createdAt: -1 })
    res.json(posts)
  }
)

export { router as getPostsByUsersRouter }
