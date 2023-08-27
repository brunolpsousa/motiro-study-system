import express from 'express'
import cookieParser from 'cookie-parser'
import 'dotenv/config'
import '@mongo/connections'

const { PORT, COOKIE_SECRET } = process.env
const port = PORT || 5000
const app = express()

app.use(express.json())
app.use(cookieParser(COOKIE_SECRET))

// const { DB_PORT, DB_HOST, DB_NAME } = process.env
// const URI = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`

// import { connect, ConnectOptions } from 'mongoose'

// const connectDB = async (url: string) => {
//   return await connect(url, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   } as ConnectOptions)
// }

// const instructor_id = '64e63e72c68276da74a6b5eb'
// const student_id = '64e54b147521114cca52f6ea'
// const lesson_id = '64e561b15fb2b48749c3bacd'

import { authController as aC } from 'applications/controllers'
import { authMiddleware as aM } from 'applications/controllers'
import { MongoRepository } from '@mongo/mongoRepository'

const db = new MongoRepository()
const getInstructor = async (req: Request, res: Response) => {
  const user = await db.findInstructorById({ _id: req.params.id })

  aM.chechUserPermissions(
    req.body as unknown as { user: { role: string; userId: string } },
    user._id
  )
  res.status(200).json(user)
}
app.post('/api/v1/auth/register', (req, res) => aC.register(req, res))
app.post('/api/v1/auth/login', (req, res) => aC.login(req, res))
app.post('/api/v1/auth/logout', (req, res) => aC.logout(req, res))
app.get('/api/v1/student/:id', aM.authUser, (_, res) => res.send('a student'))
app.get(
  '/api/v1/student',
  aM.authUser,
  aM.checkRole('admin', 'instructor'),
  (_, res) => res.send('all students')
)
app.get('/api/v1/instructor/:id', aM.authUser, getInstructor)
app.get('/api/v1/instructor', aM.authUser, (_, res) =>
  res.send('all instructors')
)

app.listen(port, async () => {
  // await connectDB(URI)
  console.log(`Server is listening on port ${port}`)
})
