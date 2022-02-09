import express, { Request, Response } from 'express'
import {
  BadRequestError,
  protectRoute,
  validateRequest,
} from '@geekfindr/common'
import { body, param } from 'express-validator'

import { Post } from '../models/post'

const router = express.Router()

const requestBodyValiatorMiddlewares = [
  body('mediaType')
    .optional()
    .isIn(['image'])
    .withMessage('Unsupported media type.'),
  body('isProject')
    .optional()
    .isBoolean()
    .withMessage('Invalid isProject flag.'),
  body('mediaURL').optional().isURL().withMessage('Invalid media URL.'),
  body('description').optional().isString().withMessage('Invalid description.'),
  body('isOrganization')
    .optional()
    .isBoolean()
    .withMessage('Invalid isOrganization flag.'),
  param('id')
    .notEmpty()
    .withMessage('Id is required')
    .isMongoId()
    .withMessage('Invalid id.'),
  validateRequest,
]

router.patch(
  '/api/v1/posts/:id',
  protectRoute,
  requestBodyValiatorMiddlewares,
  async (req: Request, res: Response) => {
    const { mediaType, isProject, mediaURL, description, isOrganization } =
      req.body
    const id = req.params.id
    if (mediaType && !mediaURL) {
      throw new BadRequestError('Media URL should be provided.')
    }
    const post = await Post.findById(id)
    if (!post) {
      throw new BadRequestError('Post does not exist.')
    }
    post.mediaType = mediaType ?? post.mediaType
    //////////////////////////////////////////////////////////////////////////////
    //ToDo: change the post into a project type or vice versa
    //////////////////////////////////////////////////////////////////////////////
    //post.isProject = isProject ?? post.isProject

    post.mediaURL = mediaURL ?? post.mediaURL
    post.description = description ?? post.description
    post.isOrganization = isOrganization ?? post.isOrganization
    await post.save()
    const updatedPost = await Post.findById(id)
    res.json(updatedPost)
  }
)

export { router as updatePostRouter }
