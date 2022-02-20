import express, { Request, Response } from 'express'
import {
  BadRequestError,
  ForbiddenOperationError,
  protectRoute,
  validateRequest,
} from '@geekfindr/common'
import { param, body } from 'express-validator'

import { Project } from '../models/project'
import { MemberTypes } from '../models/memberTypes'
import { User } from '../models/user'
import { protectProject } from '../middlewares/protectProject'
import { hasHigerRank } from '../helpers/compareRanks'

const router = express.Router()

const requestBodyValidatorMiddlewares = [
  param('projectId').isMongoId().withMessage('Invalid Id'),
  param('memberId').isMongoId().withMessage('Invalid Member Id'),
  body('role')
    .notEmpty()
    .withMessage('Role is required')
    .bail()
    .custom((val) => Object.values(MemberTypes).includes(val))
    .withMessage('Invalid Role'),
  validateRequest,
]

router.put(
  '/api/v1/projects/:projectId/team/:memberId/role',
  protectRoute,
  requestBodyValidatorMiddlewares,
  protectProject,
  async (req: Request, res: Response) => {
    // fetching the project and the user
    const findProjectQuery = Project.findById(req.params.projectId)
    const findUserQuery = User.findById(req.params.memberId)
    const [project, user] = await Promise.all([findProjectQuery, findUserQuery])
    if (!project) {
      throw new BadRequestError('Project not found')
    }
    if (!user) {
      throw new BadRequestError('User not found')
    }
    // fetching the current user
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
    // and if the role is not higher than or equal to the current user's role.
    if (
      hasHigerRank(currentUser!.role, otherUser.role) &&
      hasHigerRank(currentUser!.role, req.body.role)
    ) {
      project.team = project?.team?.map((member) => {
        if (member.user.toString() === req.params.memberId) {
          member.role = req.body.role
        }
        return member
      })
    } else {
      throw new ForbiddenOperationError()
    }
    await project.save()
    res.send(project)
  }
)

export { router as updateMemberRouter }
