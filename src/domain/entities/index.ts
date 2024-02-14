import { User } from '../../user/dto/user.dto'
import {
  Instructor,
  Schedule
} from '../../instructor/dto/instructor-entity.dto'
import { Student } from '../../student/dto/student-entity.dto'
import { Lesson, LessonFile } from '../../lesson/dto/lesson-entity.dto'
import {
  ApiError,
  BadRequestError,
  UnauthorizedError,
  TokenExpiredError,
  CastError,
  ValidationError,
  ForbiddenError,
  NotFoundError,
  ConflictError
} from './error'

export enum ENTITIES {
  ADMIN = 'admin',
  INSTRUCTOR = 'instructor',
  STUDENT = 'student'
}

export {
  User as Admin,
  Instructor,
  Schedule,
  Student,
  Lesson,
  LessonFile,
  ApiError,
  BadRequestError,
  UnauthorizedError,
  TokenExpiredError,
  CastError,
  ValidationError,
  ForbiddenError,
  NotFoundError,
  ConflictError
}
