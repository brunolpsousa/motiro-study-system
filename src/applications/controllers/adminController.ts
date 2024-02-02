import { Controller, Get } from '@nestjs/common'
import { AdminUseCase } from '@usecases'
import { Request, Response } from 'express'

@Controller('a')
export class AdminController {
  constructor(private useCase: AdminUseCase) {}
  async create(req: Request, res: Response) {
    const { name, email, password } = req.body

    const result = await this.useCase.create({
      name,
      email,
      password
    })

    return res.status(201).json(result)
  }

  async listOne(req: Request, res: Response) {
    const id = req.params.id
    const result = await this.useCase.listOne(id)
    return res.status(200).json(result)
  }

  @Get()
  async listAll(_: Request, res: Response) {
    return await this.useCase.listAll()
    // return res.status(200).json(result)
  }

  async update(req: Request, res: Response) {
    const id = req.params.id
    const { name, email, password } = req.body

    await this.useCase.update({
      id,
      name,
      email,
      password
    })

    return res.status(200).send()
  }

  async delete(req: Request, res: Response) {
    const id = req.params.id
    await this.useCase.delete(id)
    return res.status(200).send()
  }
}
