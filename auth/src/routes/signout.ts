import express from 'express'

const router = express.Router()

router.post('/api/v1/users/signout', (req, res) => {
  res.cookie('token', '', { httpOnly: true, expires: new Date(0) }).send()
})

export { router as signoutRouter }
