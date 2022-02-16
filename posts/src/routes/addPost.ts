import express, { Request, Response } from 'express'
import {
  BadRequestError,
  protectRoute,
  validateRequest,
} from '@geekfindr/common'
import { body } from 'express-validator'
import mongoose from 'mongoose'

import { Post } from '../models/post'
import { User } from '../models/user'
import { ProjectCreatedPublisher } from '../events/publishers/projectCreatedPublisher'
import { natsWrapper } from '../natsWrapper'

const router = express.Router()

const requestBodyValiatiorMiddlewares = [
  body('mediaType')
    .notEmpty()
    .withMessage('Media type is required.')
    .bail()
    .isIn(['image'])
    .withMessage('Unsupported media type.'),
  body('isProject')
    .notEmpty()
    .withMessage('isProject flag is required.')
    .bail()
    .isBoolean()
    .withMessage('Invalid isProject flag.'),
  body('mediaURL')
    .notEmpty()
    .withMessage('Media URL is required.')
    .bail()
    .isURL()
    .withMessage('Invalid media URL.'),
  body('description')
    .notEmpty()
    .withMessage('Description is required.')
    .bail()
    .isString()
    .withMessage('Invalid description.'),
  body('isOrganization')
    .notEmpty()
    .withMessage('isOrganization flag is required.')
    .bail()
    .isBoolean()
    .withMessage('Invalid isOrganization flag.'),
  body('projectName')
    .custom((value, { req }) => {
      if (req.body.isProject) {
        return value !== undefined
      }
      return true
    })
    .withMessage('Project name is required.')
    .bail()
    .isString()
    .withMessage('Invalid project name.'),
  validateRequest,
]

router.post(
  '/api/v1/posts',
  protectRoute,
  requestBodyValiatiorMiddlewares,
  async (req: Request, res: Response) => {
    const { mediaType, isProject, mediaURL, description, isOrganization } =
      req.body
    const existingPost = await Post.findOne({
      owner: req.user.id,
      mediaType,
      isProject,
      mediaURL,
      description,
      isOrganization,
    })
    if (existingPost) {
      throw new BadRequestError('Cannot have duplicate posts.')
    }
    const post = await Post.build({
      mediaType,
      isProject,
      mediaURL,
      description,
      isOrganization,
      owner: req.user.id,
    }).save()

    // Publish project-created event
    if (isProject) {
      new ProjectCreatedPublisher(natsWrapper.client).publish({
        id: post._id as string,
        name: req.body.projectName as string,
        owner: req.user.id,
      })
    }

    //save post to the follower's feed
    const user = await User.findById(req.user.id)
    const followers = user?.followers
    const followersIds = followers?.map(
      (follower) => new mongoose.Types.ObjectId(follower)
    )
    await User.updateMany(
      { _id: { $in: followersIds } },
      { $push: { feed: { $each: [post._id], $position: 0 } } }
    )

    res.json(post)
  }
)

export { router as addPostRouter }
