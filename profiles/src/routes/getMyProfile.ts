import express, { Request, Response } from 'express'
import { BadRequestError, protectRoute } from '@geekfindr/common'

import { Profile, ProfileDoc } from '../models/profile'

const router = express.Router()

router.get(
  '/api/v1/profiles/my-profile',
  protectRoute,
  async (req: Request, res: Response) => {
    let profile: ProfileDoc = (await Profile.findOne({
      _id: req.user.id,
    })) as ProfileDoc

    if (!profile) {
      throw new BadRequestError('Profile not found')
    }
    res.status(200).json({
      ...profile.toJSON(),
    })
  }
)

export { router as getMyProfileRouter }
