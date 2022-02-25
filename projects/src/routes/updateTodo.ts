import express, { request, Request, Response } from 'express'
import { protectRoute, validateRequest } from '@geekfindr/common'
import { body, param } from 'express-validator'

import { protectProject } from '../middlewares/protectProject'

const requestBodyValidatorMiddlewares = [
  body('todo')
    .isArray()
    .withMessage('Invalid todo')
    .bail()
    .custom((val) => {
      let isValid = true
      let isStringArray = (data: any) => {
        if (!Array.isArray(data)) {
          return false
        }
        for (let item of data) {
          if (typeof item !== 'string') {
            return false
          }
        }
        return true
      }
      // verifying that todo is of desired structure.
      // {todo: string, tasks: string[]}[]
      val.every((todo: any) => {
        if (
          typeof todo !== 'object' ||
          !todo.hasOwnProperty('title') ||
          !todo.hasOwnProperty('tasks') ||
          !isStringArray(todo.tasks)
        ) {
          isValid = false
        }
        return true
      })
      return isValid
    })
    .withMessage('Invalid todo'),
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
    const project = req.project
    project.todo = req.body.todo
    await project.save()
    res.send({})
  }
)

export { router as updateTodoRouter }
