import { Student } from '@entities'

export abstract class StudentRepository {
  abstract findById(id: string): Promise<Student | null>
  abstract save(student: Student): Promise<Student>
  abstract update(student: Student): Promise<void>
  abstract delete(id: string): Promise<void>
  abstract findAll(): Promise<Student[]>
  abstract count(): Promise<number>
  abstract comparePassword(id: string, password: string): Promise<boolean>
  abstract whoAmI(): string
}
