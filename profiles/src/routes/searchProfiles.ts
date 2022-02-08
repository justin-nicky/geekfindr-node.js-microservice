import express, { Request, Response } from 'express'
import { protectRoute, validateRequest } from '@geekfindr/common'
import { query } from 'express-validator'

import { Profile } from '../models/profile'

const router = express.Router()

const requestBodyValidatorMiddlewares = [
  query('searchUserName')
    .notEmpty()
    .withMessage('searchUserName is required.')
    .bail()
    .isString()
    .withMessage('searchUserName should be string.'),
  query('searchRole')
    .optional()
    .isString()
    .withMessage('searchRole should be string.'),
  validateRequest,
]

router.get(
  '/api/v1/profiles',
  protectRoute,
  requestBodyValidatorMiddlewares,
  async (req: Request, res: Response) => {
    let match = { username: {}, role: {} }
    match.username = req.query.searchUserName
      ? {
          $regex: req.query.searchUserName,
          $options: 'i',
        }
      : {
          $regex: '',
        }
    match.role = req.query.searchRole
      ? { $regex: req.query.searchRole, $options: 'i' }
      : {
          $regex: '',
        }
    const profiles = await Profile.aggregate([
      {
        $match: match,
      },
      { $limit: 20 },
      {
        $project: {
          id: '$_id',
          email: 1,
          username: 1,
          avatar: 1,
          bio: 1,
          organizations: 1,
          followersCount: 1,
          followingCount: 1,
          experience: 1,
          education: 1,
          works: 1,
          skills: 1,
          socials: 1,
          role: 1,
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
    ])
    res.send(profiles)
  }
)

export { router as searchProfiles }
