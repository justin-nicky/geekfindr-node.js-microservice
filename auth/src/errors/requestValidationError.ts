import { ValidationError } from 'express-validator'

import { CustomError } from './customError'

export class RequestValidationError extends CustomError {
  statusCode = 422
  constructor(private errors: ValidationError[]) {
    super('Error validating request parameters')
    Object.setPrototypeOf(this, RequestValidationError.prototype)
  }
  serializeErrors() {
    return this.errors.map((error) => ({
      message: error.msg,
      field: error.param,
    }))
  }
}
