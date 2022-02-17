import express, { Request, Response } from 'express'
import { protectRoute } from '@geekfindr/common'

import { Post } from '../models/post'

const router = express.Router()

router.get(
  '/api/v1/posts/projectNames',
  protectRoute,
  async (req: Request, res: Response) => {
    const projectNames = await Post.aggregate([
      {
        $match: { isProject: true },
      },
      {
        $group: {
          _id: null,
          projectNames: { $push: '$projectName' },
        },
      },
      {
        $project: {
          projectNames: 1,
          _id: 0,
        },
      },
    ])
    res.json(projectNames)
  }
)

export { router as getProjectNamesRouter }
