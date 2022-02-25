import express, { Request, Response } from 'express'
import {
  BadRequestError,
  ForbiddenOperationError,
  protectRoute,
  validateRequest,
} from '@geekfindr/common'
import { param, body } from 'express-validator'

import { MemberTypes } from '../models/memberTypes'
import { User } from '../models/user'
import { protectProject } from '../middlewares/protectProject'
import { hasHigerRank } from '../helpers/compareRanks'
import mongoose from 'mongoose'

const router = express.Router()

const requestBodyValidatorMiddlewares = [
  param('projectId').isMongoId().withMessage('Invalid Id'),
  param('memberId').isMongoId().withMessage('Invalid Member Id'),
  body('role')
    .notEmpty()
    .withMessage('Role is required')
    .bail()
    .custom((val) =>
      [MemberTypes.Admin, MemberTypes.Collaborator].includes(val)
    )
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
    // updating the user and the project
    // check if the user already has a role in the project
    const userProject = user.projects.find(
      (_project) => _project.project.toString() === req.params.projectId
    )
    if (userProject) {
      userProject.role = req.body.role
    } else {
      user.projects.push({
        project: new mongoose.Types.ObjectId(req.params.projectId),
        role: req.body.role,
      })
    }
    await Promise.all([project.save(), user.save()])
    res.send(project)
  }
)

export { router as updateMemberRouter }
