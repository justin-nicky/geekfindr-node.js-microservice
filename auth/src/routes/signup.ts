import express, { Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
import md5 from 'md5'

import { RequestValidationError } from '../errors/requestValidationError'
import { User } from '../models/user'
import { BadRequestError } from '../errors/badRequestError'
import { generateToken } from '../utils/generateToken'

const router = express.Router()

const requestBodyValidators = [
  body('email').isEmail().withMessage('Email id is not valid'),
  body('password')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Password should be between 4 and 20 characters in length'),
]

router.get(
  '/api/v1/users/signup',
  requestBodyValidators,
  async (req: Request, res: Response) => {
    //validating the request body
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array())
    }
    const { email, password } = req.body

    //checking if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      throw new BadRequestError('User already exists')
    }

    //generating profile image using gravatar
    const avatar = `https://www.gravatar.com/avatar/${md5(
      email.trim().toLowerCase()
    )}?d=retro`

    //creating new user
    const user = User.build({ email, password, avatar })
    await user.save()

    //generating auth token
    const token = generateToken({ userId: user.id, email: user.email })
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
