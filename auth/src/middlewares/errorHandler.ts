import { Request, Response, NextFunction } from 'express'

import { CustomError } from '../errors/customError'

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    res.status(err.statusCode).json({ errors: err.serializeErrors() })
  } else {
    res.status(500).json({ errors: [{ message: 'Internal server error' }] })
  }
}
