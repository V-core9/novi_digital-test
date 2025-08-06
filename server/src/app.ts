import path from 'path'
import cookieParser from 'cookie-parser'

import * as middlewares from './middleware/index.middleware'
import indexRouter from './routes/index'
import usersRouter from './routes/users'

import { config } from 'dotenv'
import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import cors from 'cors'

config()

const app = express()

app.use(morgan('dev'))
app.use(helmet())
app.use(cors())
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

// API Routes
app.use('/', indexRouter)
app.use('/users', usersRouter)

// Not Found (404) & Error Handlers
app.use(middlewares.notFound)
app.use(middlewares.errorHandler)

export default app
