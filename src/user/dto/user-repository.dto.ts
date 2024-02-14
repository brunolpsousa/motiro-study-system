import { User } from './user.dto'

export abstract class UserRepository {
  abstract findById(id: string): Promise<User | null>
  abstract findAll(): Promise<User[]>
  abstract save(admin: User): Promise<User>
  abstract update(admin: User): Promise<void>
  abstract delete(id: string): Promise<void>
  abstract count(): Promise<number>
  abstract comparePassword(id: string, password: string): Promise<boolean>
  abstract whoAmI(): string
}
