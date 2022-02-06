import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { protectRoute, validateRequest } from '@geekfindr/common'

const router = express.Router()

const requestBodyValidatorMiddlewares = [
  body('id')
    .notEmpty()
    .withMessage('Id should be provided')
    .bail()
    .isMongoId()
    .withMessage('Invalid id'),
  validateRequest,
]

router.post(
  '/api/v1/profiles/following',
  protectRoute,
  requestBodyValidatorMiddlewares,
  async (req: Request, res: Response) => {}
)

export { router as addFollowingRouter }
