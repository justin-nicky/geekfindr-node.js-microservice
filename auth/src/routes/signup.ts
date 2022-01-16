import express, { Request, Response } from 'express'
import { body, validationResult } from 'express-validator'

import { RequestValidationError } from '../errors/requestValidationError'

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
  (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array())
    }
    res.send({})
  }
)

export { router as signupRouter }
