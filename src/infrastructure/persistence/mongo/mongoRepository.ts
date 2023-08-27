import { Instructor } from 'domain/entities/instructor'
import { InstructorRepository } from 'domain/repository/instructorRepository'

import { instructorModel, studentModel } from '.'
import { StudentRepository } from 'domain/repository/studentRepository'
import { Student } from 'domain/entities/students'

export class MongoRepository
  implements InstructorRepository, StudentRepository
{
  // Insctuctor methods

  async findInstructorById(id: string): Promise<Instructor | null> {
    return await instructorModel.findById(id).select('-password')
  }
  async saveInstructor(instructor: Instructor): Promise<Instructor> {
    return await instructorModel.create(instructor)
  }
  async updateInstructor(instructor: Instructor): Promise<void> {
    await instructorModel.updateOne({ _id: instructor.id }, instructor)
  }
  async deleteInstructor(id: string): Promise<void> {
    await instructorModel.deleteOne().where({ _id: id })
  }

  // Student methods

  async findStudentById(id: string): Promise<Student | null> {
    return await studentModel.findById(id).select('-password')
  }
  async saveStudent(student: Student): Promise<Student> {
    return await studentModel.create(student)
  }
  async updateStudent(student: Student): Promise<void> {
    await instructorModel.updateOne({ _id: student.id }, student)
  }
  async deleteStudent(id: string): Promise<void> {
    await instructorModel.deleteOne().where({ _id: id })
  }
}
