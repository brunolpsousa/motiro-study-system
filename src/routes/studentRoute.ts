// import { StudentUseCase } from '@usecases'
// import { StudentController } from '@controllers'
// import { MongoStudentRepository } from '@mongo'
// import { authMiddleware, verifyToken } from '@middlewares'
// import { Router } from 'express'

// const studentRepository = new MongoStudentRepository()
// const studentUseCase = new StudentUseCase(studentRepository)
// const studentController = new StudentController(studentUseCase)

// const router = Router()

// router
//   .route('/student')
//   .all(verifyToken, authMiddleware.authUser)
//   .post(authMiddleware.checkRole('admin'), (req, res) =>
//     studentController.create(req, res)
//   )
//   .get(authMiddleware.checkRole('admin', 'instructor'), (req, res) =>
//     studentController.listAll(req, res)
//   )

// router
//   .route('/student/:id')
//   .all(verifyToken, authMiddleware.authUser)
//   .get((req, res) => studentController.listOne(req, res))
//   .patch((req, res) => studentController.update(req, res))
//   .delete((req, res) => studentController.delete(req, res))

// export default router
