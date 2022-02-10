import { BadRequestError, protectRoute } from '@geekfindr/common'
import express, { Request, Response } from 'express'
import { Post } from '../models/post'

const router = express.Router()

router.get(
  '/api/v1/posts/:id/comments',
  protectRoute,
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
