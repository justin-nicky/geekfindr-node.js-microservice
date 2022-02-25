import express, { Request, Response } from 'express'
import {
  protectRoute,
  validateRequest,
  BadRequestError,
  ForbiddenOperationError,
} from '@geekfindr/common'
import { param, body } from 'express-validator'
import { protectProject } from '../middlewares/protectProject'
import mongoose from 'mongoose'

const router = express.Router()

const requestBodyValiatiorMiddlewares = [
  body('isComplete')
    .notEmpty()
    .withMessage('isComplete flag is required.')
    .bail()
    .isBoolean()
    .withMessage('Invalid isComplete flag.'),
  param('projectId').isMongoId().withMessage('Invalid project id.'),
  param('task-title').notEmpty().isString().withMessage('Invalid task title.'),
  validateRequest,
]

router.put(
  '/api/v1/projects/:projectId/tasks/:taskTitle/completion-status',
  protectRoute,
  requestBodyValiatiorMiddlewares,
  protectProject,
  async (req: Request, res: Response) => {
    const project = req.project
    const user = req.user
    const { taskTitle } = req.params
    const { isComplete } = req.body

    const task = project.task?.find((_task) => _task.title === taskTitle)
    if (!task) {
      throw new BadRequestError('Task not found.')
    }
    if (!task.users.includes(user.id as unknown as mongoose.Types.ObjectId)) {
      throw new ForbiddenOperationError()
    }
    task.isComplete = isComplete
    await project.save()
    res.send({})
  }
)

export { router as markTaskAsCompletedRouter }
