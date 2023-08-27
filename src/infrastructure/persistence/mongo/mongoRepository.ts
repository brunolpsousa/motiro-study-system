import { Instructor } from 'domain/entities/instructor'
import { InstructorRepository } from 'domain/repository/instructorRepository'

import { instructorModel } from './instructorModel'
import { StudentRepository } from 'domain/repository/studentRepository'
import { Student } from 'domain/entities/students'
import { studentModel } from './studentModel'

export class MongoRepository
  implements InstructorRepository, StudentRepository
{
  // Insctuctor methods

  async findInstructorById(id: string): Promise<Instructor | null> {
    const result = await instructorModel.findById(id)
    return result
  }
  async saveInstructor(instructor: Instructor): Promise<Instructor> {
    const result = await instructorModel.create(instructor)
    return result
  }
  async updateInstructor(instructor: Instructor): Promise<void> {
    await instructorModel.updateOne({ _id: instructor.id }, instructor)
  }
  async deleteInstructor(id: string): Promise<void> {
    await instructorModel.deleteOne().where({ _id: id })
  }

  // Student methods

  async findStudentById(id: string): Promise<Student | null> {
    const result = await studentModel.findById(id)
    return result
  }
  async saveStudent(student: Student): Promise<Student> {
    const result = await studentModel.create(student)
    return result
  }
  async updateStudent(student: Student): Promise<void> {
    await instructorModel.updateOne({ _id: student.id }, student)
  }
  async deleteStudent(id: string): Promise<void> {
    await instructorModel.deleteOne().where({ _id: id })
  }
}
