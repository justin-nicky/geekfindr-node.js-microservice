import express, { Request, Response } from 'express'
import AWS from 'aws-sdk'
import crypto from 'crypto'
import { BadRequestError, protectRoute } from '@geekfindr/common'

const router = express.Router()
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
})

router.get(
  '/api/v1/uploads/signed-url',
  protectRoute,
  async (req: Request, res: Response) => {
    const acceptedTypes = ['image/gif', 'image/jpeg', 'image/jpg', 'image/png']
    const contentType = req.headers['content-type']

    if (contentType && acceptedTypes.includes(contentType)) {
      // Generate a random name for the image file
      const key = `${req.user.id}/${crypto.randomBytes(32).toString('hex')}.${
        contentType.split('/')[1]
      }`

      // Generate a signed URL for the image file
      const params = {
        Bucket: 'geekfindr-uploads-bucket',
        ContentType: contentType,
        Key: key,
      }
      s3.getSignedUrl('putObject', params, (err, url) => {
        if (err) {
          console.error(err)
          throw new BadRequestError("Couldn't generate signed URL")
        }

        console.log(key, url)
        res.send({ key, url })
      })
    } else {
      throw new BadRequestError('Invalid content type')
    }
  }
)

export { router as getSignedURLRouter }
