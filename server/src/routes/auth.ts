import express from 'express'
const router = express.Router()

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import User from '../models/User'
import { generateAccessToken, generateRefreshToken } from '../utils/jwt'

/* POST register new user. */
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) return res.status(400).json({ message: 'Email already in use' })

    // ✅ Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = new User({ firstName, lastName, email, password: hashedPassword })
    await user.save()

    res.status(201).json({ message: 'User created', user: { email, firstName, lastName } })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

/* POST login route */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ message: 'Invalid credentials' })

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' })

    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)

    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

/* POST refresh access token so user can stay logged in */
router.post('/refresh-token', (req, res) => {
  const { refreshToken } = req.body

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token required' })
  }

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, payload) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired refresh token' })

    const accessToken = generateAccessToken({ _id: payload.userId })
    const refreshToken = generateRefreshToken({ _id: payload.userId })

    res.json({ accessToken, refreshToken })
  })
})

export default router
