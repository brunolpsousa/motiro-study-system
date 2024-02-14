import { Admin } from '../../admin/dto/admin-entity.dto'
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
  Admin,
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
