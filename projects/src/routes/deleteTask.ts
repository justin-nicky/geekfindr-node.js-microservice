import express, { Request, Response } from 'express'
import {
  protectRoute,
  validateRequest,
  BadRequestError,
  ForbiddenOperationError,
} from '@geekfindr/common'
import { param } from 'express-validator'

import { protectProject } from '../middlewares/protectProject'

const router = express.Router()

const requestBodyValiatiorMiddlewares = [
  param('projectId').isMongoId().withMessage('Invalid project id.'),
  param('task-title').notEmpty().isString().withMessage('Invalid task title.'),
  validateRequest,
]

router.delete(
  '/api/v1/projects/:projectId/tasks/:taskTitle',
  protectRoute,
  requestBodyValiatiorMiddlewares,
  protectProject,
  async (req: Request, res: Response) => {
    const project = req.project
    const user = req.user
    const { taskTitle } = req.params

    const task = project.task?.find((_task) => _task.title === taskTitle)
    if (!task) {
      throw new BadRequestError('Task not found.')
    }

    const isOwner = project.owner.toString() === user.id
    const isAssignor = task.assignor.toString() === user.id
    if (!isOwner || !isAssignor) {
      throw new ForbiddenOperationError()
    }

    project.task = project.task?.filter((_task) => _task.title !== taskTitle)
    await project.save()

    res.send({})
  }
)

export { router as deleteTaskRouter }
