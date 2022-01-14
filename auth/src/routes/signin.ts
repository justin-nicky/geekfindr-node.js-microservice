import express from 'express';

const router = express.Router();

router.post('/api/v1/users/signin', (req, res) => {
    res.send('hi')
})

export { router as signinRouter };