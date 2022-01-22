import express, { urlencoded, json } from 'express'
import 'express-async-errors'
import cors from 'cors'
import { errorHandler, NotFoundError } from '@geekfindr/common'
import morgan from 'morgan'

import { connectDB } from './config/db'
import { updateMyProfileRouter } from './routes/updateMyProfile'

const app = express()
app.use(cors())
app.set('trust proxy', true)
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(morgan('tiny'))

app.get('/', (req, res) => {
  res.send('Hello World')
})
app.use(updateMyProfileRouter)
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
  connectDB()
  app.listen(3000, () => {
    console.log('Profile service listening on port 3000...')
  })
}
start()
