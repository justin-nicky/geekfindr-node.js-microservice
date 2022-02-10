import {
  BadRequestError,
  protectRoute,
  validateRequest,
} from '@geekfindr/common'
import express, { Request, Response } from 'express'
import { body, param } from 'express-validator'
import { Post } from '../models/post'

const router = express.Router()

const requestBodyValiatiorMiddlewares = [
  body('comment')
    .notEmpty()
    .withMessage('Comment should be provided.')
    .bail()
    .isString()
    .withMessage('Comment should be of string type.'),
  param('id').isMongoId().withMessage('Invalid id.'),
  validateRequest,
]

router.post(
  '/api/v1/posts/:id/comments',
  protectRoute,
  requestBodyValiatiorMiddlewares,
  async (req: Request, res: Response) => {
    const id = req.params.id
    const comment = req.body.comment
    const post = await Post.findById(id)
    if (!post) {
      throw new BadRequestError('Invalid id.')
    }
    post.commentCount++
    post.comments.push({ comment, owner: req.user.id })
    await post.save()
    res.json({})
  }
)

export { router as addCommentRouter }
