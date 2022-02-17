// Todo: project-join-request route
import {
  BadRequestError,
  protectRoute,
  validateRequest,
} from '@geekfindr/common'
import express, { Request, Response } from 'express'
import { param } from 'express-validator'
import { ProjectJoinRequestPublisher } from '../events/publishers/projectJoinRequestPublisher'
import { Post } from '../models/post'
import { natsWrapper } from '../natsWrapper'

const router = express.Router()

const requestBodyValiatiorMiddlewares = [
  param('id').isMongoId().withMessage('Invalid id.'),
  validateRequest,
]

router.post(
  '/api/v1/posts/:id/team-join-requests',
  protectRoute,
  requestBodyValiatiorMiddlewares,
  async (req: Request, res: Response) => {
    const id = req.params.id
    const post = await Post.findById(id)
    if (!post) {
      throw new BadRequestError('Invalid id.')
    }

    if (
      post.teamJoinRequests.find(
        (teamJoinRequest) => teamJoinRequest.owner.toString() === req.user.id
      )
    ) {
      throw new BadRequestError('Alredy requested.')
    }
    post.teamJoinRequestCount++
    post.teamJoinRequests.push({ owner: req.user.id })
    await post.save()

    // publishing project-join-request event
    new ProjectJoinRequestPublisher(natsWrapper.client).publish({
      projectId: id,
      userId: req.user.id,
    })

    res.json({})
  }
)

export { router as addTeamJoinRequestRouter }
