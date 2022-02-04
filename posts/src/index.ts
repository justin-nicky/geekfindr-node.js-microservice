import express, { urlencoded, json } from 'express'
import 'express-async-errors'
import cors from 'cors'
import morgan from 'morgan'
import { errorHandler, NotFoundError } from '@geekfindr/common'

import { connectDB } from './config/db'
import { connectEventBus } from './config/eventBus'
import { natsWrapper } from './natsWrapper'
import { getSignedURLRouter } from './routes/getSignedURL'
import { addPostRouter } from './routes/addPost'
import { getMyPostsRouter } from './routes/getMyPosts'

const app = express()
app.use(cors())
app.set('trust proxy', true)
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(morgan('tiny'))

app.get('/api/v1/posts', (req, res) => {
  res.send('Hello World')
})
app.use(getSignedURLRouter)
app.use(addPostRouter)
app.use(getMyPostsRouter)

app.all('*', () => {
  throw new NotFoundError()
})
app.use(errorHandler)

const start = async () => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET must be defined')
  }
  if (!process.env.MONGO_URL) {
    throw new Error('MONGO_URL must be defined')
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined')
  }
  if (!process.env.AWS_ACCESS_KEY_ID) {
    throw new Error('AWS_ACCESS_KEY_ID must be defined')
  }
  if (!process.env.AWS_SECRET_ACCESS_KEY) {
    throw new Error('AWS_SECRET_ACCESS_KEY must be defined')
  }
  connectDB()
  connectEventBus()
  //close the connection to the event bus when the server stops
  natsWrapper.client.on('close', () => {
    console.log('NATS connection closed!')
    process.exit()
  })
  process.on('SIGINT', () => natsWrapper.client.close())
  process.on('SIGTERM', () => natsWrapper.client.close())

  app.listen(3000, () => {
    console.log('Post service listening on port 3000...')
  })
}
start()
