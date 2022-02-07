import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import {
  protectRoute,
  validateRequest,
  BadRequestError,
} from '@geekfindr/common'

import { Profile } from '../models/profile'
import { ProfileFollowingAddedPublisher } from '../events/listeners/profileFollowingAddedPublisher'
import { natsWrapper } from '../natsWrapper'

const router = express.Router()

const requestBodyValidatorMiddlewares = [
  body('id')
    .notEmpty()
    .withMessage('Id should be provided')
    .bail()
    .isMongoId()
    .withMessage('Invalid id'),
  validateRequest,
]

router.post(
  '/api/v1/profiles/following',
  protectRoute,
  requestBodyValidatorMiddlewares,
  async (req: Request, res: Response) => {
    const secondUserId = req.body.id
    if (secondUserId === req.user.id) {
      throw new BadRequestError('You cannot follow yourself.')
    }
    const secondUserProfile = await Profile.findById(secondUserId)
    if (!secondUserProfile) {
      throw new BadRequestError('User not found.')
    }
    const firstUserProfile = await Profile.findById(req.user.id)

    //checking if they are already following
    if (firstUserProfile?.following?.includes(secondUserId)) {
      throw new BadRequestError('Already following.')
    }
    //adding new follower to the second user
    if (
      secondUserProfile &&
      secondUserProfile.followers !== undefined &&
      secondUserProfile.followersCount !== undefined
    ) {
      secondUserProfile.followers.push(req.user.id)
      secondUserProfile.followersCount++
    }
    //adding new following to the first user
    if (
      firstUserProfile &&
      firstUserProfile.following !== undefined &&
      firstUserProfile.followingCount !== undefined
    ) {
      firstUserProfile.following.push(secondUserId)
      firstUserProfile.followingCount++
    }
    await Promise.all([firstUserProfile?.save(), secondUserProfile?.save()])

    //publishing profile-following-added event
    new ProfileFollowingAddedPublisher(natsWrapper.client).publish({
      followerId: req.user.id,
      followeeId: secondUserId,
    })
    res.json({})
  }
)

export { router as addFollowingRouter }
