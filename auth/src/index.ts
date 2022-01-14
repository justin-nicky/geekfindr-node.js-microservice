import express from 'express';
import { json } from 'body-parser';

import { signupRouter } from './routes/signup';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';

const app = express()

app.use(json())

app.use(signinRouter)
app.use(signupRouter)
app.use(signoutRouter)

app.listen(3000, () => {
    console.log('Auth service listening on port 3000')
})