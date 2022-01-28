import express, { Request, Response } from 'express'
import { checkSchema } from 'express-validator'
import { validateRequest, protectRoute } from '@geekfindr/common'

import { Profile, ProfileDoc } from '../models/profile'

const router = express.Router()

const requestBodyValidatorMiddlewares = [
  checkSchema({
    bio: {
      in: ['body'],
      optional: true,
      isString: true,
      errorMessage: 'Bio must be a string',
    },
    organizations: {
      in: ['body'],
      optional: true,
      isArray: true,
      errorMessage: 'Organizations must be an array',
      custom: {
        options: (value: Array<string>) => {
          return value.every((v) => typeof v === 'string')
        },
        errorMessage: 'Organizations must be an array of strings',
      },
    },
    experience: {
      in: ['body'],
      optional: true,
      isArray: true,
      errorMessage: 'Experience must be an array',
      custom: {
        options: (value: Array<object>) => {
          return value.every((v) => typeof v === 'object')
        },
        errorMessage: 'Experience must be an array of objects',
      },
    },
    education: {
      in: ['body'],
      optional: true,
      isArray: true,
      errorMessage: 'Education must be an array',
      custom: {
        options: (value: Array<object>) => {
          return value.every((v) => typeof v === 'object')
        },
        errorMessage: 'Education must be an array of objects',
      },
    },
    works: {
      in: ['body'],
      optional: true,
      isArray: true,
      errorMessage: 'Works must be an array',
      custom: {
        options: (value: Array<object>) => {
          return value.every((v) => typeof v === 'object')
        },
        errorMessage: 'Works must be an array of objects',
      },
    },
    skills: {
      in: ['body'],
      optional: true,
      isArray: true,
      errorMessage: 'Skills must be an array',
      custom: {
        options: (value: Array<string>) => {
          return value.every((v) => typeof v === 'string')
        },
        errorMessage: 'Skills must be an array of strings',
      },
    },
    socials: {
      in: ['body'],
      optional: true,
      isArray: true,
      errorMessage: 'Socials must be an array',
      custom: {
        options: (value: Array<object>) => {
          return value.every((v) => typeof v === 'object')
        },
        errorMessage: 'Socials must be an array of objects',
      },
    },
  }),
  validateRequest,
]

router.patch(
  '/api/v1/profiles/my-profile',
  protectRoute,
  requestBodyValidatorMiddlewares as any,
  async (req: Request, res: Response) => {
    const {
      bio,
      organizations,
      experience,
      education,
      works,
      skills,
      socials,
    } = req.body
    let profile: ProfileDoc = (await Profile.findOne({
      _id: req.user.id,
    })) as ProfileDoc

    if (!profile) {
      throw new Error('Profile not found')
    }
    if (bio) {
      profile.bio = bio
    }
    if (organizations) {
      profile.organizations = organizations
    }
    if (experience) {
      profile.experience = experience
    }
    if (education) {
      profile.education = education
    }
    if (works) {
      profile.works = works
    }
    if (skills) {
      profile.skills = skills
    }
    if (socials) {
      profile.socials = socials
    }
    await profile.save()
    const updatedPfofile = await Profile.findOne({ userId: req.user.id })
    res.status(200).json({
      ...updatedPfofile!.toJSON(),
    })
  }
)

export { router as updateMyProfileRouter }
