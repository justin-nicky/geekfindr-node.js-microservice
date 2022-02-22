import express, { Request, Response } from 'express'
import {
  protectRoute,
  validateRequest,
  BadRequestError,
} from '@geekfindr/common'
import { body, param } from 'express-validator'

import { protectProject } from '../middlewares/protectProject'
import { Project } from '../models/project'

const requestBodyValidatorMiddlewares = [
  body('todo').isArray().withMessage('Invalid todo'),
  param('projectId').isMongoId().withMessage('Invalid project id'),
  validateRequest,
]

const router = express.Router()

router.put(
  '/api/v1/projects/:projectId/todo',
  protectRoute,
  requestBodyValidatorMiddlewares,
  protectProject,
  async (req: Request, res: Response) => {
    const project = await Project.findById(req.params.projectId)
    if (!project) {
      throw new BadRequestError('Project not found')
    }
    project.todo = req.body.todo
    await project.save()
    res.send(project)
  }
)

export { router as updateTodoRouter }
