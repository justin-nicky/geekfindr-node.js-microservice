import express, { Request, Response } from 'express'
import {
  BadRequestError,
  protectRoute,
  validateRequest,
} from '@geekfindr/common'
import { body } from 'express-validator'

import { Post } from '../models/post'

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
    res.json(post)
  }
)

export { router as addPostRouter }
