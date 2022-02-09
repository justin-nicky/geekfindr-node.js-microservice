import express, { Request, Response } from 'express'
import { protectRoute } from '@geekfindr/common'

import { Post } from '../models/post'

const router = express.Router()

router.get(
  '/api/v1/posts/my-posts',
  protectRoute,
  async (req: Request, res: Response) => {
    const posts = await Post.find({
      owner: req.user.id,
      isDeleted: false,
    })
      .populate('owner', 'username avatar')
      .sort({ createdAt: -1 })
    res.json(posts)
  }
)

export { router as getMyPostsRouter }
