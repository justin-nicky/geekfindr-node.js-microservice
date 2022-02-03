import express, { Request, Response } from 'express'
import { protectRoute, validateRequest } from '@geekfindr/common'
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

// interface PostAttrs {
//     isProject: boolean
//     mediaType: MediaTypes
//     mediaURL: string
//     description: string
//     likeCount: number
//     comments?: object[]
//     teamJoinRequests?: object[]
//     isOrganization: boolean
//     owner: string
//   }

router.post(
  '/api/v1/posts',
  protectRoute,
  requestBodyValiatiorMiddlewares,
  (req: Request, res: Response) => {
    res.send({})
  }
)
