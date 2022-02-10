import {
  BadRequestError,
  protectRoute,
  validateRequest,
} from '@geekfindr/common'
import express, { Request, Response } from 'express'
import { param } from 'express-validator'
import { Post } from '../models/post'

const router = express.Router()

const requestBodyValiatiorMiddlewares = [
  param('id').isMongoId().withMessage('Invalid id.'),
  validateRequest,
]

router.post(
  '/api/v1/posts/:id/likes',
  protectRoute,
  requestBodyValiatiorMiddlewares,
  async (req: Request, res: Response) => {
    const id = req.params.id
    const post = await Post.findById(id)
    if (!post) {
      throw new BadRequestError('Invalid id.')
    }

    if (post.likes.find((like) => like.owner.toString() === req.user.id)) {
      throw new BadRequestError('Alredy liked this post.')
    }
    post.likeCount++
    post.likes.push({ owner: req.user.id })
    await post.save()
    res.json({})
  }
)

export { router as addLikeRouter }
