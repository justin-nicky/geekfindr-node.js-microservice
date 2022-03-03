import {
  BadRequestError,
  ForbiddenOperationError,
  protectRoute,
  validateRequest,
} from '@geekfindr/common'
import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import mongoose from 'mongoose'

import { protectProject } from '../middlewares/protectProject'
import { hasHigerRank } from '../helpers/compareRanks'
import { MemberTypes } from '../models/memberTypes'
import { TaskTypes } from '../models/taskTypes'

const router = express.Router()

const ObjectId = mongoose.Types.ObjectId

const requestBodyValidatorMiddlewares = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .bail()
    .isString()
    .withMessage('Title must be a string'),
  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .bail()
    .isString()
    .withMessage('Description must be a string'),
  body('type')
    .optional()
    .isString()
    .withMessage('Type must be a string')
    .custom((val) => Object.values(TaskTypes).includes(val)),
  body('users')
    .notEmpty()
    .withMessage('Users is required')
    .bail()
    .isArray()
    .withMessage('Users must be an array of user ids')
    .custom((value) => {
      let isMongoIdArray = (data: any) => {
        for (let item of data) {
          if (!ObjectId.isValid(item) || String(new ObjectId(item)) !== item) {
            return false
          }
        }
        return true
      }
      // verifying that users is an array of mongodb ids.
      return isMongoIdArray(value)
    })
    .withMessage('Invalid user ids.'),
  validateRequest,
]

router.post(
  '/api/v1/projects/:projectId/tasks',
  protectRoute,
  requestBodyValidatorMiddlewares,
  protectProject,
  async (req: Request, res: Response) => {
    const user = req.user
    const project = req.project
    const { title, description, users, type } = req.body as {
      title: string
      description: string
      users: mongoose.Types.ObjectId[]
      type: TaskTypes | undefined
    }

    // Checking if project already has a task with the same title.
    const hasTaskWithSameTitle = project.task?.some(
      (_task) => _task.title === title
    )
    if (hasTaskWithSameTitle) {
      throw new BadRequestError('Task with the same title already exists.')
    }

    // Checking if the user has permission to do this operation
    // ie, if every assignees has a lower rank than the assignor.
    const currentUserRole = project?.team?.find(
      (teamMember) => teamMember.user.toString() === user.id
    )?.role as MemberTypes

    const teamMemberIds =
      project?.team?.map((teamMember) => teamMember.user.toString()) ?? []

    users.every((userId) => {
      let isUserInTeam = teamMemberIds.includes(userId.toString())
      let otherUserRole = project?.team?.find(
        (teamMember) => teamMember.user.toString() === userId.toString()
      )?.role as MemberTypes

      if (!isUserInTeam || hasHigerRank(otherUserRole, currentUserRole)) {
        throw new ForbiddenOperationError()
      }
    })

    project.task?.push({
      title,
      description,
      users,
      isComplete: false,
      assignor: new mongoose.Types.ObjectId(user.id),
      ...(type && { type }),
    })

    await project.save()
    res.send({})
  }
)

export { router as addTaskRouter }
