// import {
//   AdminUseCase,
//   AuthUseCase,
//   InstructorUseCase,
//   StudentUseCase
// } from '@usecases'
// import { AuthController } from '@controllers'
// import {
//   MongoAdminRepository,
//   MongoInstructorRepository,
//   MongoStudentRepository
// } from '@mongo'

// import { Router } from 'express'

// const mongoAdmRepository = new MongoAdminRepository()
// const adminUseCase = new AdminUseCase(mongoAdmRepository)

// const mongoInstRepository = new MongoInstructorRepository()
// const instructorUseCase = new InstructorUseCase(mongoInstRepository)

// const mongoStuRepository = new MongoStudentRepository()
// const studentUseCase = new StudentUseCase(mongoStuRepository)

// const authUseCase = new AuthUseCase(
//   adminUseCase,
//   instructorUseCase,
//   studentUseCase
// )

// const authController = new AuthController(authUseCase)
// const router = Router()

// router.post('/auth/register', (req, res) => authController.register(req, res))
// router.post('/auth/login', (req, res) => authController.login(req, res))
// router.get('/auth/logout', (_, res) => authController.logout(_, res))

// export default router
