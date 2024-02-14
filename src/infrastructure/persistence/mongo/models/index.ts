import { Schema } from 'mongoose'
import { adminModel } from './adminModel'
import { instructorModel } from './instructorModel'
import { studentModel } from './studentModel'
import { lessonModel } from './lessonModel'

export interface UserSchema extends Schema {
  comparePassword(password: string): Promise<boolean>
}

export { adminModel, instructorModel, studentModel, lessonModel }
export * from './userModel'
