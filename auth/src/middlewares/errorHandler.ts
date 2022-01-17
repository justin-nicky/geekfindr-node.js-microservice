import { Request, Response, NextFunction } from 'express'

import { CustomError } from '../errors/customError'

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({ errors: err.serializeErrors() })
  } else {
    console.error(err)
    res.status(500).json({ errors: [{ message: 'Something went wrong!' }] })
  }
}
