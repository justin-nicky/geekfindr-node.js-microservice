import express, { Request, Response } from 'express'
import {
  BadRequestError,
  protectRoute,
  validateRequest,
} from '@geekfindr/common'
import { param } from 'express-validator'

import { Project } from '../models/project'
import { protectProject } from '../middlewares/protectProject'

const router = express.Router()

const requestBodyValidatorMiddlewares = [
  param('projectId').isMongoId().withMessage('Invalid project id'),
  validateRequest,
]

router.get(
  '/api/v1/projects/:projectId',
  protectRoute,
  requestBodyValidatorMiddlewares,
  protectProject,
  async (req: Request, res: Response) => {
    const project = await Project.findOne({
      _id: req.params.projectId,
      isDeleted: false,
    })
      .populate([
        {
          path: 'owner',
          select: 'username avatar',
        },
        {
          path: 'team.user',
          select: 'username avatar',
        },
      ])
      .select('-team._id -task._id -todo._id')
    if (!project) {
      throw new BadRequestError('Project not found')
    }
    res.send(project)
  }
)

export { router as getProjectRouter }
