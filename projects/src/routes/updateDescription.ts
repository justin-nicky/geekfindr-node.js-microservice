import express, { Request, Response } from 'express'
import { protectRoute, validateRequest } from '@geekfindr/common'
import { param, body } from 'express-validator'

import { Project } from '../models/project'

const router = express.Router()

const requestBodyValidatorMiddlewares = [
  param('id').isMongoId().withMessage('Invalid Id'),
  body('description').notEmpty().withMessage('Description is required'),
  validateRequest,
]

router.put(
  '/api/v1/projects/:id/description',
  protectRoute,
  requestBodyValidatorMiddlewares,
  async (req: Request, res: Response) => {
    const project = await Project.findById(req.params.id)
    if (!project) {
      throw new Error('Project not found')
    }
    project.description = req.body.description
    await project.save()
    res.send(project)
  }
)

export { router as updateDescriptionRouter }
