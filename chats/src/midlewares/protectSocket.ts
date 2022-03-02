import jwt from 'jsonwebtoken'
import { Socket } from 'socket.io'

export interface UserPayload {
  id: string
  email: string
  username: string
  avatar?: string
}
const protectSocket = (socket: Socket, next: any) => {
  const token = socket.handshake.auth.token
  if (token) {
    try {
      jwt.verify(token, process.env.JWT_SECRET!) as UserPayload
      next()
    } catch (error) {
      console.error(error)
      next(new Error('Not authorized, Token is invalid'))
    }
  } else {
    next(new Error('Not authorized, No token'))
  }
}

export { protectSocket }
