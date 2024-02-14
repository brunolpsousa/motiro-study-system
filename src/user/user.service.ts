import { Schedule, User } from './dto'
import { Injectable, NotFoundException } from '@nestjs/common'
import { MongoService } from 'mongo'

@Injectable()
export class UserService {
  constructor(private mongoService: MongoService) {}

  async create(dto: User): Promise<User> {
    const user = new User(dto)
    const response = await this.mongoService.save(user)
    return response
  }

  async listOne(id: string): Promise<User> {
    const response = await this.mongoService.findById(id)
    if (!response) throw new NotFoundException(`User not found`)
    return response
  }

  async listAll(): Promise<User[]> {
    return await this.mongoService.findAll()
  }

  async update(userId: string, dto: User): Promise<void> {
    const userExists = await this.mongoService.findById(userId)

    if (!userExists) throw new NotFoundException('User not found')

    const user = new User(dto, userId)
    return await this.mongoService.update(user)
  }

  async updateSchedule(id: string, request: Schedule): Promise<void> {
    const instructorExists = await this.mongoService.findById(id)

    if (!instructorExists) {
      throw new NotFoundException('Instructor not found')
    }

    return await this.mongoService.updateSchedule(id, request)
  }

  async delete(id: string): Promise<void> {
    const userExists = await this.mongoService.findById(id)

    if (!userExists) {
      throw new NotFoundException('User not found')
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
