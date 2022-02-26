import express, { Request, Response } from 'express'
import { protectRoute, validateRequest } from '@geekfindr/common'
import { param, body } from 'express-validator'

import { protectProject } from '../middlewares/protectProject'

const router = express.Router()

const requestBodyValidatorMiddlewares = [
  param('projectId').isMongoId().withMessage('Invalid project id'),
  body('description').notEmpty().withMessage('Description is required'),
  validateRequest,
]

router.put(
  '/api/v1/projects/:projectId/description',
  protectRoute,
  requestBodyValidatorMiddlewares,
  protectProject,
  async (req: Request, res: Response) => {
    const project = req.project

    project.description = req.body.description
    await project.save()

    res.send(project)
  }
)

export { router as updateDescriptionRouter }
