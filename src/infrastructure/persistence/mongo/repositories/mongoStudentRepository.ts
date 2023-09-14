import { Student } from 'domain/entities/students'
import { StudentRepository } from 'domain/repositories/studentRepository'
import { Document, ObjectId, isValidObjectId } from 'mongoose'
import { studentModel } from '../models/studentModel'
import { CastError } from 'domain/entities'

interface StudentDocument extends Document {
  _id: ObjectId
  id: string
  name: string
  email: string
  role: string
}

export class MongoStudentRepository implements StudentRepository {
  async findById(id: string): Promise<Student | null> {
    if (!isValidObjectId(id)) {
      throw new CastError('Invalid ID')
    }

    const result: StudentDocument = await studentModel
      .findById(id)
      .select('-password')

    if (result) {
      return new Student(result)
    }

    return null
  }
  async save(student: Student): Promise<Student> {
    const result: StudentDocument = (
      await studentModel.create(student)
    ).toObject()

    return new Student(
      {
        name: result.name,
        email: result.email,
        role: result.role
      },
      result.id
    )
  }
  async update(student: Student): Promise<void> {
    const { password, ...user } = student

    await studentModel
      .findOneAndUpdate({ _id: student.id }, user)
      .then(user => {
        if (user && password) {
          user.markModified('password')
          user.set({ password: password })
          user.save()
        }
      })
  }
  async delete(id: string): Promise<void> {
    await studentModel.deleteOne().where({ _id: id })
  }
  async findAll(): Promise<Student[]> {
    const result: StudentDocument[] = await studentModel
      .find()
      .select('-password')

    const students: Student[] = []

    for (let item of result) {
      const student: Student = {
        id: item._id.toString(),
        name: item.name,
        email: item.email,
        role: item.role
      }

      students.push(student)
    }

    return students
  }

  async count(): Promise<number> {
    return await studentModel.countDocuments()
  }

  async comparePassword(id: string, password: string): Promise<boolean> {
    const user = await studentModel.findById(id)
    if (!user) return false
    return await user?.comparePassword(password)
  }

  whoAmI(): string {
    const user = new Student({ name: '', email: '' })
    return user.role || 'student'
  }
}
