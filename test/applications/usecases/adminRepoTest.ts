import { AdminRepository } from '@repositories'
import { Admin } from 'user/dto/user-entities.dto'

const users: Admin[] = [
  {
    id: 'testId',
    name: 'AdminTest',
    email: 'admintest@mail.com',
    password: 'secret',
    role: 'admin'
  },
  {
    id: 'testId2',
    name: 'AdminTest2',
    email: 'admintest2@mail.com',
    password: 'secret2',
    role: 'admin'
  }
]

export class AdminRepoTest implements AdminRepository {
  async findById(id: string): Promise<Admin | null> {
    for (const user of users) {
      if (user.id === id) return user
    }
    return null
  }
  async findAll(): Promise<Admin[]> {
    const admins: Admin[] = []
    for (const user of users) {
      admins.push(user)
    }
    return admins
  }
  async save(admin: Admin): Promise<Admin> {
    const result: Admin = new Admin(admin)
    users.push(result)
    return result
  }
  async update(admin: Admin): Promise<void> {
    for (const user of users) {
      if (user.id === admin.id) {
        user.name = admin.name ?? user.name
        user.email = admin.email ?? user.email
        user.password = admin.password ?? user.password
      }
    }
  }
  async delete(id: string): Promise<void> {
    for (let i = 0; i < users.length; i++) {
      if (users[i].id === id) {
        users.splice(i, 1)
      }
    }
  }
  async count(): Promise<number> {
    return users.length
  }
  async comparePassword(id: string, password: string): Promise<boolean> {
    for (const user of users) {
      if (user.id === id) return user.password === password
    }
    return false
  }
  whoAmI(): string {
    const user = new Admin({ name: '', email: '' })
    return user.role || 'admin'
  }
}
