import jwt from 'jsonwebtoken'

export const generateToken = (userData: Object): string => {
  return jwt.sign(userData, process.env.JWT_SECRET!, { expiresIn: '1d' })
}
