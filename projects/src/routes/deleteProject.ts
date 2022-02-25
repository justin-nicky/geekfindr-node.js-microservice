import express, { Request, Response } from 'express'
import { protectRoute, validateRequest } from '@geekfindr/common'
import { param } from 'express-validator'
import { protectProject } from '../middlewares/protectProject'
import { ProjectDeletedPublisher } from '../events/publishers/projectDeletedPublisher'
import { natsWrapper } from '../natsWrapper'

const router = express.Router()

const requestBodyValiatiorMiddlewares = [
  param('projectId').isMongoId().withMessage('Invalid project id.'),
  validateRequest,
]

router.delete(
  '/api/v1/projects/:projectId',
  protectRoute,
  requestBodyValiatiorMiddlewares,
  protectProject,
  async (req: Request, res: Response) => {
    const project = req.project
    project.isDeleted = true
    await project.save()
    // Publish project-deleted event
    new ProjectDeletedPublisher(natsWrapper.client).publish({
      id: project.id,
    })
    res.send({})
  }
)

export { router as deleteTaskRouter }
