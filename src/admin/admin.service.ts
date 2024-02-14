import { Admin } from './dto'
import { Injectable, NotFoundException } from '@nestjs/common'
import { MongoService } from 'mongo'

@Injectable()
export class AdminService {
  constructor(private mongoService: MongoService) {}

  async create(dto: Admin): Promise<Admin> {
    const admin = new Admin(dto)
    const response = await this.mongoService.save(admin)
    return response
  }

  async listOne(id: string): Promise<Admin> {
    const response = await this.mongoService.findById(id)
    if (!response) throw new NotFoundException(`Admin not found`)
    return response
  }

  async listAll(): Promise<Admin[]> {
    return await this.mongoService.findAll()
  }

  async update(userId: string, dto: Admin): Promise<void> {
    const adminExists = await this.mongoService.findById(userId)

    if (!adminExists) throw new NotFoundException('Admin not found')

    const admin = new Admin(dto, userId)
    return await this.mongoService.update(admin)
  }

  async delete(id: string): Promise<void> {
    const adminExists = await this.mongoService.findById(id)

    if (!adminExists) {
      throw new NotFoundException('Admin not found')
    }

    await this.mongoService.delete(id)
  }

  async countDocuments(): Promise<number> {
    return await this.mongoService.count()
  }

  async comparePassword(id: string, password: string): Promise<boolean> {
    return await this.mongoService.comparePassword(id, password)
  }

  whoAmI(): string {
    return this.mongoService.whoAmI()
  }
}
