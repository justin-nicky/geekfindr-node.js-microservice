import express, { Request, Response } from 'express'
import { protectRoute } from '@geekfindr/common'

import { Project } from '../models/project'

const router = express.Router()

router.get(
  '/api/v1/projects/projectNames',
  protectRoute,
  async (req: Request, res: Response) => {
    const projectNames = await Project.aggregate([
      {
        $match: {},
      },
      {
        $group: {
          _id: null,
          projectNames: { $push: '$name' },
        },
      },
      {
        $project: {
          projectNames: 1,
          _id: 0,
        },
      },
    ])
    res.json(projectNames[0]?.projectNames ?? [])
  }
)

export { router as getProjectNamesRouter }
