import express, { urlencoded, json } from 'express'
import 'express-async-errors'
import cors from 'cors'
import { errorHandler, NotFoundError } from '@geekfindr/common'
import morgan from 'morgan'

import { connectDB } from './config/db'
import { updateMyProfileRouter } from './routes/updateMyProfile'
import { getMyProfileRouter } from './routes/getMyProfile'
import { connectEventBus } from './config/eventBus'
import { natsWrapper } from './natsWrapper'
import { addFollowingRouter } from './routes/addFollowing'
import { searchProfiles } from './routes/searchProfiles'
import { getProfile } from './routes/getProfile'
import { getFollowers } from './routes/getFollowers'
import { getFollowing } from './routes/getFollowing'

const app = express()
app.use(cors())
app.set('trust proxy', true)
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(morgan('tiny'))

app.use(getMyProfileRouter)
app.use(updateMyProfileRouter)
app.use(addFollowingRouter)
app.use(getFollowers)
app.use(getFollowing)
app.use(searchProfiles)
app.use(getProfile)
app.get('/api/v1/profiles', (req, res) => {
  res.send('Hello World')
})
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
    console.log('Profile service listening on port 3000...')
  })
}
start()
