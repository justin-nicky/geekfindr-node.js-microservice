import express, { Request, Response } from 'express'
import { protectRoute, validateRequest } from '@geekfindr/common'
import { param } from 'express-validator'

import { Profile } from '../models/profile'

const router = express.Router()

const requestBodyValidatorMiddlewares = [
  param('id')
    .notEmpty()
    .withMessage('id is required.')
    .bail()
    .isMongoId()
    .withMessage('Invalid id.'),
  validateRequest,
]

router.get(
  '/api/v1/profiles/:id',
  protectRoute,
  requestBodyValidatorMiddlewares,
  async (req: Request, res: Response) => {
    const profile = await Profile.findById(req.params.id)
    if (!profile) {
      throw new Error('Profile not found.')
    }
    profile.followers = undefined
    profile.following = undefined

    res.send(profile)
  }
)

export { router as getProfile }
