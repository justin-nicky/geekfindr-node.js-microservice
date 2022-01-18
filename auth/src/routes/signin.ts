import express, { Request, Response } from 'express'
import { body, validationResult } from 'express-validator'

import { RequestValidationError } from '../errors/requestValidationError'

const router = express.Router()

const requestBodyValidators = [
  body('email').isEmail().withMessage('Email id is not valid or not provided'),
  body('password').trim().notEmpty().withMessage('Password is required'),
]

router.post(
  '/api/v1/users/signin',
  requestBodyValidators,
  (req: Request, res: Response) => {
    //validating the request body
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array())
    }
    const { email, password } = req.body
    //res.send('hi')
  }
)

export { router as signinRouter }
