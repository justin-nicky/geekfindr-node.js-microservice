import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { NotAuthorizedError } from '../errors/notAuthorizedError'

interface UserPayload {
  id: string
  email: string
  username: string
}

declare global {
  namespace Express {
    interface Request {
      user: UserPayload
    }
  }
}

const protectRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token: string = ''

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
  } else if (req.headers.cookie) {
    token = req.headers.cookie.split('=')[1]
  }

  if (token !== '') {
    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET!) as UserPayload
      next()
    } catch (error) {
      console.error(error)
      throw new NotAuthorizedError()
    }
  } else {
    throw new NotAuthorizedError()
  }
}

export { protectRoute }
