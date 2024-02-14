import { Student } from '@entities'
import { NotFoundError } from '@errors'
import { StudentRepository } from '@repositories'

export class StudentUseCase {
  constructor(private studentRepository: StudentRepository) {}

  async create(request: Student): Promise<Student> {
    const student = new Student(request)

    const response = await this.studentRepository.save(student)

    return response
  }

  async listAll(): Promise<Student[]> {
    const response = await this.studentRepository.findAll()

    return response
  }

  async listOne(id: string): Promise<Student> {
    const studentExists = await this.studentRepository.findById(id)

    if (!studentExists) {
      throw new NotFoundError('Student not found')
    }

    return studentExists
  }

  async update(id: string, request: Student): Promise<void> {
    const studentExists = await this.studentRepository.findById(id)

    if (!studentExists) {
      throw new NotFoundError('Student not found')
    }

    const student = new Student(request, id)

    return await this.studentRepository.update(student)
  }

  async delete(id: string): Promise<void> {
    const studentExists = await this.studentRepository.findById(id)

    if (!studentExists) {
      throw new NotFoundError('Student not found')
    }

    await this.studentRepository.delete(id)
  }

  async countDocuments(): Promise<number> {
    return await this.studentRepository.count()
  }

  async comparePassword(id: string, password: string): Promise<boolean> {
    return await this.studentRepository.comparePassword(id, password)
  }

  whoAmI(): string {
    return this.studentRepository.whoAmI()
  }
}
