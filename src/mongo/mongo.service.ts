import { Admin } from '@entities'
import { CastError, ConflictError } from '@errors'
import { Document, isValidObjectId, ObjectId } from 'mongoose'
import { adminModel, instructorModel, studentModel } from '@models'
import { Injectable } from '@nestjs/common'

interface AdminDocument extends Document {
  _id: ObjectId
  id: string
  name: string
  email: string
  role: string
}

@Injectable()
export class MongoService {
  async findById(id: string): Promise<Admin | null> {
    if (!isValidObjectId(id)) throw new CastError('Invalid ID')

    const result: AdminDocument = await adminModel
      .findById(id)
      .select('-password')
    if (result) return new Admin(result, id)
    return null
  }

  async findAll(): Promise<Admin[]> {
    const result: AdminDocument[] = await adminModel.find().select('-password')

    const admins: Admin[] = []

    for (const item of result) {
      const admin: Admin = {
        id: item._id.toString(),
        name: item.name,
        email: item.email,
        role: item.role
      }

      admins.push(admin)
    }
    return admins
  }
  async save(admin: Admin): Promise<Admin> {
    const result: AdminDocument = (await adminModel.create(admin)).toObject()

    return new Admin(
      {
        name: result.name,
        email: result.email,
        role: result.role
      },
      result.id
    )
  }
  async update(admin: Admin): Promise<void> {
    const { password, ...user } = admin
    if (user.email) {
      const instructorExists = await instructorModel.findOne({
        email: user.email
      })
      const studentExists = await studentModel.findOne({ email: user.email })
      if (instructorExists || studentExists)
        throw new ConflictError('Provided email is already registered')
    }
    await adminModel
      .findOneAndUpdate({ _id: admin.id }, user, { runValidators: true })
      .then(user => {
        if (user && password) {
          user.markModified('password')
          user.set({ password: password })
          user.save()
        }
      })
  }
  async delete(id: string): Promise<void> {
    await adminModel.deleteOne().where({ _id: id })
  }

  async count(): Promise<number> {
    return await adminModel.countDocuments()
  }

  async comparePassword(id: string, password: string): Promise<boolean> {
    const user = await adminModel.findById(id)
    if (!user) return false
    return await user?.comparePassword(password)
  }

  whoAmI(): string {
    const user = new Admin({ name: '', email: '' })
    return user.role || 'admin'
  }
}
