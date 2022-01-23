import express, { Request, Response } from 'express'
import { protectRoute } from '@geekfindr/common'

import { Profile, ProfileDoc } from '../models/profile'

const router = express.Router()

router.get(
  '/api/v1/profiles/my-profile',
  protectRoute,
  async (req: Request, res: Response) => {
    let profile: ProfileDoc = (await Profile.findOne({
      userId: req.user.userId,
    })) as ProfileDoc

    if (!profile) {
      profile = Profile.build({
        email: req.user.email,
        userId: req.user.userId,
        username: req.user.username,
        avatar: req.user.avatar,
      }) as any
      await profile.save()
      profile = (await Profile.findOne({
        userId: req.user.userId,
      })) as ProfileDoc
    }
    res.status(200).json({
      ...profile.toJSON(),
    })
  }
)

export { router as getMyProfileRouter }
