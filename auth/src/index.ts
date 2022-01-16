import express from 'express'
import { json } from 'body-parser'
import 'express-async-errors'

import { signupRouter } from './routes/signup'
import { signinRouter } from './routes/signin'
import { signoutRouter } from './routes/signout'
import { errorHandler } from './middlewares/errorHandler'
import { NotFoundError } from './errors/notFoundError'

const app = express()

app.use(json())

app.get('/', (req, res) => {
  res.send('Hello World')
})
app.use(signinRouter)
app.use(signupRouter)
app.use(signoutRouter)

app.all('*', () => {
  throw new NotFoundError()
})
app.use(errorHandler)

app.listen(3000, () => {
  console.log('Auth service listening on port 3000...')
})
