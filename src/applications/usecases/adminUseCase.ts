import { Admin } from '@entities'
import { NotFoundError } from '@errors'
import { AdminRepository } from '@repositories'
import { Injectable } from '@nestjs/common'
import { MongoAdminRepository } from '@mongo'

@Injectable()
export class AdminUseCase {
  constructor(private adminRepository: MongoAdminRepository) {}

  async create(req: Admin): Promise<Admin> {
    const admin = new Admin(req)
    const response = await this.adminRepository.save(admin)
    return response
  }

  async listOne(id: string): Promise<Admin> {
    const response = await this.adminRepository.findById(id)
    if (!response) throw new NotFoundError(`Admin not found`)
    return response
  }

  async listAll(): Promise<Admin[]> {
    return await this.adminRepository.findAll()
    // const response = 'a' as unknown as Admin[]
    // return response
  }

  async update(req: Admin): Promise<void> {
    const adminExists = await this.adminRepository.findById(req.id!)

    if (!adminExists) {
      throw new NotFoundError('Admin not found')
    }

    const admin = new Admin(req, req.id)
    await this.adminRepository.update(admin)
  }

  async delete(id: string): Promise<void> {
    const adminExists = await this.adminRepository.findById(id)

    if (!adminExists) {
      throw new NotFoundError('Admin not found')
    }

    await this.adminRepository.delete(id)
  }

  async countDocuments(): Promise<number> {
    return await this.adminRepository.count()
  }

  async comparePassword(id: string, password: string): Promise<boolean> {
    return await this.adminRepository.comparePassword(id, password)
  }

  whoAmI(): string {
    return this.adminRepository.whoAmI()
  }
}
