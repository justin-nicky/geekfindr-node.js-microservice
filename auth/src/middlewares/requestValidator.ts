import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import { RequestValidationError } from '../errors/requestValidationError'

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //validating the request body
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array())
  }
  next()
}
