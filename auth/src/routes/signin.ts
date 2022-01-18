import express, { Request, Response } from 'express'
import { body, validationResult } from 'express-validator'

const router = express.Router()

const requestBodyValidators = [
  body('email')
    .exists()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email id is not valid'),
  body('password').exists().withMessage('Password is required'),
]

router.post(
  '/api/v1/users/signin',
  requestBodyValidators,
  (req: Request, res: Response) => {
    res.send('hi')
  }
)

export { router as signinRouter }
