// import { InstructorUseCase } from '@usecases'
// import { InstructorController } from '@controllers'
// import { authMiddleware, verifyToken } from '@middlewares'
// import { MongoInstructorRepository } from '@mongo'
// import { Router } from 'express'

// const mongoRepository = new MongoInstructorRepository()
// const instructorUseCase = new InstructorUseCase(mongoRepository)
// const instructorController = new InstructorController(instructorUseCase)

// const router = Router()

// router
//   .route('/instructor')
//   .all(verifyToken, authMiddleware.authUser)
//   .post(authMiddleware.checkRole('admin'), (req, res) =>
//     instructorController.create(req, res)
//   )
//   .get((req, res) => instructorController.listAll(req, res))

// router
//   .route('/instructor/:id')
//   .all(verifyToken, authMiddleware.authUser)
//   .get((req, res) => instructorController.listOne(req, res))
//   .patch((req, res) => instructorController.update(req, res))
//   .delete((req, res) => instructorController.delete(req, res))

// export default router
