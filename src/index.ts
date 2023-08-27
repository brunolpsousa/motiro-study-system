import express from 'express'
import cookieParser from 'cookie-parser'
import 'dotenv/config'

const app = express()

const { PORT, COOKIE_SECRET } = process.env

const port = PORT || 5000
app.use(express.json())
app.use(cookieParser(COOKIE_SECRET))

import { instructorModel } from 'instructorModel'
import { studentModel } from 'studentModel'
import { lessonModel } from 'lessonModel'

const { DB_PORT, DB_HOST, DB_NAME } = process.env
const URI = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`

import { connect, ConnectOptions } from 'mongoose'

const connectDB = async (url: string) => {
  return await connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  } as ConnectOptions)
}


const instructor_id = '64e63e72c68276da74a6b5eb'
const student_id = '64e54b147521114cca52f6ea'
const lesson_id = '64e561b15fb2b48749c3bacd'

import { authController as Auth } from 'applications/controllers'
import { authMiddleware } from 'applications/controllers'

app.post('/api/v1/register', (req, res) =>
  Auth.register(req, res)
)
app.post('/api/v1/login', (req, res) =>
  Auth.login(req, res)
)
app.post('/api/v1/logout', (req, res) =>
  Auth.logout(req, res)
)
app.get('/api/v1/student/:id', authMiddleware.authUser, (_, res) => res.send('a student'))
app.get('/api/v1/student', authMiddleware.authUser, authMiddleware.checkRole('admin'), (_, res) => res.send('all students'))

app.listen(port, async () => {
  await connectDB(URI)
  console.log(`Server is listening on port ${port}`)
})
