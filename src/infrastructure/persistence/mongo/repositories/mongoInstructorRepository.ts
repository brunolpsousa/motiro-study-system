import { Instructor, Schedule } from '@entities'
import { InstructorRepository } from '@repositories'
import { CastError, ConflictError } from '@errors'
import { Document, isValidObjectId, ObjectId } from 'mongoose'
import { adminModel, instructorModel, studentModel } from '@models'

interface InstructorDocument extends Document {
  _id: ObjectId
  id: string
  name: string
  email: string
  specialty: string[]
  schedule: DateSchedule[]
  role: string
}

interface DateSchedule extends Schedule {
  id: string
}

export class MongoInstructorRepository implements InstructorRepository {
  async findById(id: string): Promise<Instructor | null> {
    if (!isValidObjectId(id)) {
      throw new CastError('Invalid ID')
    }
    const result: InstructorDocument = await instructorModel
      .findById(id)
      .select('-password')

    if (result) {
      return new Instructor(result, id)
    }
    return null
  }
  async save(instructor: Instructor): Promise<Instructor> {
    const result: InstructorDocument = (
      await instructorModel.create(instructor)
    ).toObject()

    const schedule: DateSchedule[] = []

    for (let date of result.schedule) {
      const scheduleDate: DateSchedule = {
        date: date.date,
        busy: date.busy,
        id: date.id
      }

      schedule.push(scheduleDate)
    }

    return new Instructor(
      {
        name: result.name,
        email: result.email,
        specialty: result.specialty,
        schedule: schedule,
        role: result.role
      },
      result.id
    )
  }
  async update(instructor: Instructor): Promise<void> {
    const { password, ...user } = instructor

    if (user.email) {
      const adminExists = await adminModel.findOne({ email: user.email })
      const studentExists = await studentModel.findOne({
        email: user.email
      })
      if (adminExists || studentExists)
        throw new ConflictError('Provided email is already registered')
    }

    await instructorModel
      .findOneAndUpdate({ _id: instructor.id }, user, { runValidators: true })
      .then(user => {
        if (user && password) {
          user.markModified('password')
          user.set({ password: password })
          user.save()
        }
      })
  }
  async updateSchedule(id: string, schedule: Schedule): Promise<void> {
    await instructorModel.updateOne(
      { _id: id, schedule: { $elemMatch: { _id: schedule._id } } },
      { $set: { 'schedule.$': schedule } },
      { runValidators: true }
    )
  }
  async delete(id: string): Promise<void> {
    await instructorModel.deleteOne().where({ _id: id })
  }
  async findAll(): Promise<Instructor[]> {
    const result: InstructorDocument[] = await instructorModel
      .find()
      .select('-password')
      .lean()

    const instructors: Instructor[] = []

    for (let item of result) {
      const schedule: DateSchedule[] = []

      for (let date of item.schedule) {
        const scheduleDate: DateSchedule = {
          id: date._id!.toString(),
          date: date.date,
          busy: date.busy
        }

        schedule.push(scheduleDate)
      }

      const instructor: Instructor = {
        id: item._id.toString(),
        name: item.name,
        email: item.email,
        specialty: item.specialty,
        schedule: schedule,
        role: item.role
      }

      instructors.push(instructor)
    }

    return instructors
  }

  async count(): Promise<number> {
    return await instructorModel.countDocuments()
  }

  async comparePassword(id: string, password: string): Promise<boolean> {
    const user = await instructorModel.findById(id)
    if (!user) return false
    return await user?.comparePassword(password)
  }

  whoAmI(): string {
    const user = new Instructor({
      name: '',
      email: '',
      specialty: [],
      schedule: []
    })
    return user.role || 'instructor'
  }
}
