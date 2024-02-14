import { StudentRepository } from '@repositories'
import { Student } from 'user/dto/user-entities.dto'

const users: Student[] = [
  {
    id: 'testId',
    name: 'StudentTest',
    email: 'studenttest@mail.com',
    password: 'secret',
    role: 'student'
  },
  {
    id: 'testId2',
    name: 'StudentTest2',
    email: 'studenttest@mail.com',
    password: 'secret2',
    role: 'student'
  }
]

export class StudentRepoTest implements StudentRepository {
  async findById(id: string): Promise<Student | null> {
    for (const user of users) {
      if (user.id === id) return user
    }
    return null
  }
  async findAll(): Promise<Student[]> {
    const students: Student[] = []
    for (const user of users) {
      students.push(user)
    }
    return students
  }
  async save(student: Student): Promise<Student> {
    const result: Student = new Student(student)
    users.push(result)
    return result
  }
  async update(student: Student): Promise<void> {
    for (const user of users) {
      if (user.id === student.id) {
        user.name = student.name ?? user.name
        user.email = student.email ?? user.email
        user.password = student.password ?? user.password
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
    const user = new Student({
      name: '',
      email: ''
    })
    return user.role || 'student'
  }
}
