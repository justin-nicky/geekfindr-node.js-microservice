import express, { Request, Response } from 'express'
import { body } from 'express-validator'

import { validateRequest, BadRequestError } from '@geekfindr/common'
import { User } from '../models/user'
import { Password } from '../utils/password'
import { generateToken } from '../utils/generateToken'

const router = express.Router()

const requestBodyValidators = [
  body('email').isEmail().withMessage('Email id is not valid or not provided'),
  body('password').trim().notEmpty().withMessage('Password is required'),
  validateRequest,
]

router.post(
  '/api/v1/users/signin',
  requestBodyValidators,
  async (req: Request, res: Response) => {
    const { email, password } = req.body
    //checking if user with email already exists
    const existingUser = await User.findOne({ email })
    if (!existingUser) {
      throw new BadRequestError('Account does not exist')
    }
    //checking if password is correct
    const isValidPassword = await Password.comparePasswords(
      password,
      existingUser.password!
    )
    if (!isValidPassword) {
      throw new BadRequestError('Invalid credentials')
    }
    //generating auth token
    const token = generateToken({
      userId: existingUser.id,
      email: existingUser.email,
      username: existingUser.username,
    })
    res
      .cookie('token', token, { httpOnly: true })
      .status(200)
      .json({
        ...existingUser.toJSON(),
        token: token,
      })
  }
)

export { router as signinRouter }
