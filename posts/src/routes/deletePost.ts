import express, { Request, Response } from 'express'
import { protectRoute } from '@geekfindr/common'
import { param } from 'express-validator'
import { validateRequest, BadRequestError } from '@geekfindr/common'

import { Post } from '../models/post'

const router = express.Router()

const requestBodyValiatorMiddlewares = [
  param('id')
    .notEmpty()
    .withMessage('Id is required')
    .isMongoId()
    .withMessage('Invalid id.'),
  validateRequest,
]

router.delete(
  '/api/v1/posts/:id',
  protectRoute,
  requestBodyValiatorMiddlewares,
  async (req: Request, res: Response) => {
    const id = req.params.id
    const post = await Post.findOne({
      owner: req.user.id,
      _id: id,
    })
    if (!post) {
      throw new BadRequestError('Post does not exist.')
    }
    post.isDeleted = true
    await post.save()
    res.json({})
  }
)

export { router as deletePostRouter }
