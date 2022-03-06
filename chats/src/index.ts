import express, { urlencoded, json } from 'express'
import 'express-async-errors'
import cors from 'cors'
import { errorHandler, NotFoundError } from '@geekfindr/common'
import morgan from 'morgan'
import http from 'http'
import { Server } from 'socket.io'

import { connectDB } from './config/db'
import { connectEventBus } from './config/eventBus'
import { natsWrapper } from './natsWrapper'
import { protectSocket } from './midlewares/protectSocket'
import { addConversationRouter } from './routes/addConversation'
import { getMyConversationsRouter } from './routes/getMyConversations'
import { getMessagesRouter } from './routes/getMessages'

const app = express()
const server = http.createServer(app)

app.use(cors())
app.set('trust proxy', true)
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(morgan('tiny'))

const io = new Server(server, {
  path: '/api/v1/chats/socket.io',
  cors: {
    origin: '*',
    methods: 'GET,PUT,PATCH,POST,DELETE',
  },
  allowEIO3: true,
  serveClient: false,
})

// Protecting the websocket connection (verifying the token)
io.use(protectSocket)

app.get('/api/v1/chats', (req, res) => {
  res.send('Hello World !!!!!')
})

app.use(addConversationRouter)
app.use(getMyConversationsRouter)
app.use(getMessagesRouter)

app.all('*', () => {
  throw new NotFoundError()
})
app.use(errorHandler)

io.on('connection', (socket) => {
  console.log(`New client connected: ${socket.id}`)

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`)
  })
})

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

  server.listen(3000, () => {
    console.log('Chat service listening on port 3000...')
  })
}
start()
