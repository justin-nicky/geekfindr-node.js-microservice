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

const router = express.Router()

const requestBodyValidatorMiddlewares = [
  param('projectId').isMongoId().withMessage('Invalid project id'),
  validateRequest,
]

router.get(
  '/api/v1/projects/:projectId',
  protectRoute,
  requestBodyValidatorMiddlewares,
  async (req: Request, res: Response) => {
    const project = await Project.findById(req.params.projectId)
    if (!project) {
      throw new BadRequestError('Project not found')
    }
    // Checking if the user is a member of the project
    if (
      !!project.team?.find((member) => {
        return (
          member.user.toString() === req.user!.id &&
          member.role !== MemberTypes.JoinRequest
        )
      })
    ) {
      throw new NotAuthorizedError()
    }
    res.send(project)
  }
)

export { router as getProjectRouter }
