import express, { Request, Response } from 'express'
import {
  BadRequestError,
  ForbiddenOperationError,
  protectRoute,
  validateRequest,
} from '@geekfindr/common'
import { param } from 'express-validator'

import { User } from '../models/user'
import { protectProject } from '../middlewares/protectProject'
import { hasHigerRank } from '../helpers/compareRanks'

const router = express.Router()

const requestBodyValidatorMiddlewares = [
  param('projectId').isMongoId().withMessage('Invalid id'),
  param('memberId').isMongoId().withMessage('Invalid member id'),
  validateRequest,
]

router.delete(
  '/api/v1/projects/:projectId/team/:memberId',
  protectRoute,
  requestBodyValidatorMiddlewares,
  protectProject,
  async (req: Request, res: Response) => {
    // fetching the project and the user
    const project = req.project
    const user = await User.findById(req.params.memberId)
    if (!user) {
      throw new BadRequestError('User not found')
    }

    // getting the current user
    const currentUser = project?.team?.find((member) => {
      return member.user.toString() === req.user!.id
    })
    const otherUser = project?.team?.find((member) => {
      return member.user.toString() === req.params.memberId
    })
    if (!otherUser) {
      throw new BadRequestError('Member not found')
    }

    // checking if the current user has a higher rank than the other user
    // and if both the uesrs are same(leave project functionality)
    if (
      hasHigerRank(currentUser!.role, otherUser.role) ||
      req.params.memberId === req.user!.id
    ) {
      project.team = project?.team?.filter(
        (member) => member.user.toString() !== req.params.memberId
      )
      user.projects = user?.projects?.filter(
        (project) => project.project.toString() !== req.params.projectId
      )
    } else {
      throw new ForbiddenOperationError()
    }

    await Promise.all([project.save(), user.save()])
    res.json({})
  }
)

export { router as deleteMemberRouter }
