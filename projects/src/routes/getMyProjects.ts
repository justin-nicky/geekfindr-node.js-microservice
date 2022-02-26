import express, { Request, Response } from 'express'
import { protectRoute } from '@geekfindr/common'

import { User } from '../models/user'

const router = express.Router()

router.get(
  '/api/v1/projects/my-projects',
  protectRoute,
  async (req: Request, res: Response) => {
    const projects = await User.findById(req.user.id)
      .populate({
        path: 'projects.project',
        match: { isDeleted: false },
        select: 'name description owner',
        populate: { path: 'owner', select: 'username avatar' },
      })
      .select('-projects._id')

    const projectsExcludingNull = projects?.projects?.filter(
      (_project) => _project.project !== null
    )

    res.json(projectsExcludingNull)
  }
)

export { router as getMyProjectsRouter }
