import express, { Request, Response } from 'express'
import {
  BadRequestError,
  NotAuthorizedError,
  protectRoute,
  validateRequest,
} from '@geekfindr/common'
import { param } from 'express-validator'

import { Project } from '../models/project'
import { MemberTypes } from '../models/memberTypes'
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
    const project = await Project.findById(req.params.projectId)
    if (!project) {
      throw new BadRequestError('Project not found')
    }
    res.send(project)
  }
)

export { router as getProjectRouter }
