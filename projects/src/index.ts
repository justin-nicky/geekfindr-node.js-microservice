import express, { urlencoded, json } from 'express'
import 'express-async-errors'
import cors from 'cors'
import { errorHandler, NotFoundError } from '@geekfindr/common'
import morgan from 'morgan'

import { connectDB } from './config/db'
import { connectEventBus } from './config/eventBus'
import { natsWrapper } from './natsWrapper'

import { getMyProjectsRouter } from './routes/getMyProjects'
import { updateDescriptionRouter } from './routes/updateDescription'
import { getProjectNamesRouter } from './routes/getProjectNames'
import { getProjectRouter } from './routes/getProject'
import { updateMemberRouter } from './routes/updateMember'
import { deleteMemberRouter } from './routes/deleteMember'
import { updateTodoRouter } from './routes/updateTodo'
import { addTaskRouter } from './routes/addTask'
import { markTaskAsCompletedRouter } from './routes/markTaskAsCompleted'
import { deleteTaskRouter } from './routes/deleteTask'
import { deleteProjectRouter } from './routes/deleteProject'

const app = express()
app.use(cors())
app.set('trust proxy', true)
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(morgan('tiny'))

app.get('/api/v1/projects', (req, res) => {
  res.send('Hello World!!')
})

app.use(addTaskRouter)
app.use(deleteMemberRouter)
app.use(deleteProjectRouter)
app.use(deleteTaskRouter)
app.use(getMyProjectsRouter)
app.use(getProjectNamesRouter)
app.use(getProjectRouter)
app.use(markTaskAsCompletedRouter)
app.use(updateDescriptionRouter)
app.use(updateMemberRouter)
app.use(updateTodoRouter)

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
    console.log('Project service listening on port 3000...')
  })
}
start()
