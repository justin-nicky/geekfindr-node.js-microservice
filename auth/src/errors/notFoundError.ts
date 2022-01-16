import { CustomError } from './customError'

export class NotFoundError extends CustomError {
  statusCode = 404
  reason = 'Route not found'
  constructor() {
    super('Route not found')
    Object.setPrototypeOf(this, NotFoundError.prototype)
  }
  serializeErrors() {
    return [{ message: this.reason }]
  }
}
