import express, { Request, Response } from 'express'
import AWS from 'aws-sdk'
import crypto from 'crypto'
import {
  BadRequestError,
  protectRoute,
  validateRequest,
} from '@geekfindr/common'
import { query } from 'express-validator'

const router = express.Router()
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  signatureVersion: 'v4',
  region: 'ap-south-1',
})

const requestParamValidatorMiddlewares = [
  query('fileType')
    .isString()
    .withMessage('file type is required')
    .bail()
    //as of now, only image files are allowed
    .isIn(['image'])
    .withMessage('Unsupported file type'),
  query('fileSubType')
    .isString()
    .notEmpty()
    .withMessage('File sub-type is required'),
  validateRequest,
]

router.get(
  '/api/v1/uploads/signed-url',
  protectRoute,
  requestParamValidatorMiddlewares,
  async (req: Request, res: Response) => {
    const fileType = req.query.fileType as string
    const fileSubType = req.query.fileSubType as string

    // Generate a random name for the file
    const key = `${req.user.id}/${crypto
      .randomBytes(32)
      .toString('hex')}.${fileSubType}`
    // Generate a signed URL for the file
    const params = {
      Bucket: 'geekfindr-uploads-bucket',
      ContentType: `${fileType}/${fileSubType}`,
      Key: key,
    }
    s3.getSignedUrl('putObject', params, (err, url) => {
      if (err) {
        console.error(err)
        throw new BadRequestError("Couldn't generate signed URL")
      }
      res.send({ key, url })
    })
  }
)

export { router as getSignedURLRouter }
