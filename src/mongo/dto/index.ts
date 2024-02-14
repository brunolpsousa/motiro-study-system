import { Schema } from 'mongoose'

export interface UserSchema extends Schema {
  comparePassword(password: string): Promise<boolean>
}

export * from './mongo-user-model.dto'
export * from './mongo-lesson-model.dto'
export * from './mongo-connect.dto'
