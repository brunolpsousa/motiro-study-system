import { Admin } from './admin'
import { Instructor, Schedule } from './instructor'
import { Student } from './students'
import { Lesson } from './lessons'
import {
  ApiError,
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  ForbiddenError
} from './error'

export enum ENTITIES {
  ADMIN = 'admin',
  INSTRUCTOR = 'instructor',
  STUDENT = 'student'
}

export {
  Admin,
  Instructor,
  Schedule,
  Student,
  Lesson,
  ApiError,
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  ForbiddenError
}
