import express from 'express';

const router = express.Router();

router.get('/api/v1/users/signup', (req, res) => {
    res.send('hi')
})

export { router as signupRouter };