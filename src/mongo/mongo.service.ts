import { User } from 'user/dto'
import { Document, isValidObjectId, ObjectId } from 'mongoose'
import { userModel, lessonModel } from 'mongo/dto'
import { BadRequestException, Injectable } from '@nestjs/common'
import { Schedule } from 'user/dto'
import { Lesson, LessonFile } from 'lesson/dto'

interface UserDocument extends Document {
  _id: ObjectId
  id: string
  name: string
  email: string
  role: string
}

interface LessonDocument extends Document {
  _id: ObjectId
  id: string
  instructorId: string
  studentId: string
  dateId: string
  files: []
}

@Injectable()
export class MongoService {
  async findById(id: string): Promise<User | null> {
    if (!isValidObjectId(id)) throw new BadRequestException('Invalid ID')

    const result: UserDocument = await userModel
      .findById(id)
      .select('-password')
    if (result) return new User(result, id)
    return null
  }

  async findAll(): Promise<User[]> {
    const result: UserDocument[] = await userModel.find().select('-password')

    const users: User[] = []

    for (const item of result) {
      const user: User = {
        id: item._id.toString(),
        name: item.name,
        email: item.email,
        role: item.role
      }

      users.push(user)
    }
    return users
  }

  async save(dto: User): Promise<User> {
    const result: UserDocument = (await userModel.create(dto)).toObject()

    return new User(
      {
        name: result.name,
        email: result.email,
        role: result.role
      },
      result.id
    )
  }

  async update(dto: User): Promise<void> {
    const { password, ...user } = dto
    await userModel
      .findOneAndUpdate({ _id: user.id }, user, { runValidators: true })
      .then(user => {
        if (user && password) {
          user.markModified('password')
          user.set({ password: password })
          user.save()
        }
      })
  }

  async updateSchedule(id: string, schedule: Schedule): Promise<void> {
    await userModel.updateOne(
      { _id: id, schedule: { $elemMatch: { _id: schedule._id } } },
      { $set: { 'schedule.$': schedule } },
      { runValidators: true }
    )
  }

  async delete(id: string): Promise<void> {
    await userModel.deleteOne().where({ _id: id })
  }

  async count(): Promise<number> {
    return await userModel.countDocuments()
  }

  async comparePassword(id: string, password: string): Promise<boolean> {
    const user = await userModel.findById(id)
    if (!user) return false
    return await user?.comparePassword(password)
  }

  whoAmI(): string {
    const user = new User({ name: '', email: '' })
    return user.role || 'user'
  }

  async findLessonById(id: string): Promise<Lesson | null> {
    const result: LessonDocument | null = await lessonModel.findById(id)

    if (result) {
      return new Lesson(result, id)
    }

    return null
  }

  async saveLesson(lesson: Lesson): Promise<Lesson> {
    const result: LessonDocument = (await lessonModel.create(lesson)).toObject()

    return new Lesson(
      {
        instructorId: result.instructorId,
        studentId: result.studentId,
        dateId: result.dateId,
        files: result.files
      },
      result.id
    )
  }

  async uploadFile(id: string, file: LessonFile): Promise<void> {
    await lessonModel.findOneAndUpdate(
      { _id: id },
      { $push: { files: file } },
      { new: true, runValidators: true }
    )
  }

  async deleteLesson(id: string): Promise<void> {
    await lessonModel.deleteOne().where({ _id: id })
  }

  async findAllLessons(): Promise<Lesson[]> {
    const result: LessonDocument[] = await lessonModel.find()

    const lessons: Lesson[] = []

    for (let item of result) {
      const lesson: Lesson = {
        id: item._id.toString(),
        instructorId: item.instructorId,
        studentId: item.studentId,
        dateId: item.dateId,
        files: item.files
      }

      lessons.push(lesson)
    }

    return lessons
  }

  async countLessons(): Promise<number> {
    return await lessonModel.countDocuments()
  }
}
