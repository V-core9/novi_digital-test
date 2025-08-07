import isAuthenticated from '../middleware/isAuthenticated'

import express from 'express'
const router = express.Router()

/* GET users listing. */
router.get('/', isAuthenticated, (req, res, next) => {
  res.json({ message: 'respond with a resource when AUTHENTICATED USER' })
})

export default router
