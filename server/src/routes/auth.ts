import express from 'express'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import jwt from 'jsonwebtoken'
import createSHA256 from '../utils/createSHA256'

import { generateTokens } from '../utils/jwt'

const router = express.Router()

/* POST register new user. */
router.post('/register', async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      res.status(400)
      throw new Error('You must provide an email and a password.')
    }

    const existingUser = await findUserByEmail(email)

    if (existingUser) {
      res.status(400)
      throw new Error('Email already in use.')
    }

    const username = req.body.username || uuidv4()

    const user = await createUserByEmailAndPassword({ email, password, username })

    res.json({
      id: user.id,
      username: user.username
    })
  } catch (err) {
    next(err)
  }
})

/* POST login route */
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      res.status(400)
      throw new Error('You must provide an email and a password.')
    }

    const existingUser = await findUserByEmail(email)

    if (!existingUser) {
      res.status(403)
      throw new Error('Invalid login credentials.')
    }

    const validPassword = await bcrypt.compare(password, existingUser.password)
    if (!validPassword) {
      res.status(403)
      throw new Error('Invalid login credentials.')
    }

    const jti = uuidv4()
    const { accessToken, refreshToken } = generateTokens(existingUser, jti)
    // await addRefreshTokenToWhitelist({ jti, refreshToken, userId: existingUser.id })

    res.json({
      accessToken,
      refreshToken
    })
  } catch (err) {
    next(err)
  }
})

/* POST refresh access token so user can stay logged in */
router.post('/refreshToken', async (req, res, next) => {
  try {
    const { refreshToken } = req.body
    if (!refreshToken) {
      res.status(400)
      throw new Error('Missing refresh token.')
    }
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
    const savedRefreshToken = await findRefreshTokenById(payload.jti)

    if (!savedRefreshToken || savedRefreshToken.revoked === true) {
      res.status(401)
      throw new Error('Unauthorized')
    }

    const hashedToken = createSHA256(refreshToken)
    if (hashedToken !== savedRefreshToken.hashedToken) {
      res.status(401)
      throw new Error('Unauthorized')
    }

    const user = await findUserById(payload.userId)
    if (!user) {
      res.status(401)
      throw new Error('Unauthorized')
    }

    const jti = uuidv4()
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user, jti)

    res.json({
      accessToken,
      refreshToken: newRefreshToken
    })
  } catch (err) {
    next(err)
  }
})

module.exports = router
