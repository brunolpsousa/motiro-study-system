import { authMiddleware } from '@middlewares'
import { Controller, Get } from '@nestjs/common'
import { StudentUseCase } from '@usecases'
import { Request, Response } from 'express'

@Controller('student')
export class StudentController {
  constructor(private useCase: StudentUseCase) {}

  async create(req: Request, res: Response) {
    const { name, email, password } = req.body

    const result = await this.useCase.create({ name, email, password })

    return res.status(201).json(result)
  }

  async update(req: Request, res: Response) {
    const { id } = req.params
    const { name, email, password } = req.body

    authMiddleware.checkUserPermissions(req.body, id)

    const result = await this.useCase.update(id, { name, email, password })

    return res.status(200).json(result)
  }

  @Get()
  async listAll(_: Request, res: Response) {
    const students = await this.useCase.listAll()

    return res.status(200).json(students)
  }

  async listOne(req: Request, res: Response) {
    const { id } = req.params
    authMiddleware.checkUserPermissions(req.body, id)

    const result = await this.useCase.listOne(id)

    return res.status(200).json(result)
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params

    authMiddleware.checkUserPermissions(req.body, id)

    await this.useCase.delete(id)

    return res.status(200).send()
  }
}
