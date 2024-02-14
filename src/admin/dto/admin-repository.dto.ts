import { Admin } from '@entities'

export abstract class AdminRepository {
  abstract findById(id: string): Promise<Admin | null>
  abstract findAll(): Promise<Admin[]>
  abstract save(admin: Admin): Promise<Admin>
  abstract update(admin: Admin): Promise<void>
  abstract delete(id: string): Promise<void>
  abstract count(): Promise<number>
  abstract comparePassword(id: string, password: string): Promise<boolean>
  abstract whoAmI(): string
}
