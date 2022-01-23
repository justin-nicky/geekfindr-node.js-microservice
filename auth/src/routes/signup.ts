import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import md5 from 'md5'
import { validateRequest, BadRequestError } from '@geekfindr/common'

import { User } from '../models/user'
import { generateToken } from '../utils/generateToken'

const router = express.Router()

const requestBodyValidatorMiddlewares = [
  body('email').isEmail().withMessage('Email id is not valid or not provided'),
  body('username')
    .trim()
    .isLength({ min: 3, max: 10 })
    .withMessage('Username should be between 3 and 10 characters in length'),
  body('password')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Password should be between 4 and 20 characters in length'),
  validateRequest,
]

router.post(
  '/api/v1/users/signup',
  requestBodyValidatorMiddlewares,
  async (req: Request, res: Response) => {
    const { email, password, username } = req.body

    //checking if userName already exists
    const existingUsername = await User.findOne({ username })
    if (existingUsername) {
      throw new BadRequestError('Username already taken')
    }
    //checking if user with email already exists
    const existingEmail = await User.findOne({ email })
    if (existingEmail) {
      throw new BadRequestError('Email already taken')
    }
    //generating profile image using gravatar
    const avatar = `https://www.gravatar.com/avatar/${md5(
      email.trim().toLowerCase()
    )}?d=retro`
    //creating new user
    const user = User.build({
      email,
      password,
      avatar,
      username,
    })
    await user.save()

    //generating auth token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      username: user.username,
      avatar: user.avatar,
    })
    res
      .cookie('token', token, { httpOnly: true })
      .status(201)
      .json({
        ...user.toJSON(),
        token: token,
      })
  }
)

export { router as signupRouter }
