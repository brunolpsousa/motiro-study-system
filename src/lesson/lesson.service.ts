import {
  BadRequestError,
  Instructor,
  Lesson,
  LessonFile,
  NotFoundError,
  ConflictError,
  Schedule,
  Student
} from '@entities'
import { MongoLessonRepository } from '@mongo'
import { InstructorUseCase, StudentUseCase } from '@usecases'
import { UploadedFile } from 'express-fileupload'
import { ObjectId } from 'mongoose'
import path from 'path'

interface LessonProps {
  instructor: Instructor
  student: Student
  date: Schedule
}

export interface LessonResponse {
  id: string
  instructor: { id: string; name: string }
  student: { id: string; name: string }
  lesson_date: { id: ObjectId; date: Date }
  files: LessonFile[]
}

export class LessonService {
  constructor(
    private mongoRepo: MongoLessonRepository,
    private instructorUseCase: InstructorUseCase,
    private studentUseCase: StudentUseCase
  ) {}

  private async getProps(lesson: Lesson): Promise<LessonProps> {
    const instructor = await this.instructorUseCase.listOne(lesson.instructorId)
    const student = await this.studentUseCase.listOne(lesson.studentId)
    const date = instructor.schedule.find(
      s => s._id?.toString() === lesson.dateId.toString()
    )
    return { instructor, student, date: date as Schedule }
  }

  private async handleFile(
    textFile: UploadedFile,
    userId: string
  ): Promise<LessonFile> {
    enum allowedMimeTypes {
      'application/pdf',
      'application/msword',
      'application/vnd.oasis.opendocument.text',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    }

    if (
      !(
        textFile.mimetype.startsWith('text') ||
        Object.values(allowedMimeTypes).includes(textFile.mimetype)
      )
    )
      throw new BadRequestError('Not a text file')

    const maxSize = 1024 * 1024 * 5
    if (textFile.size > maxSize) throw new BadRequestError('File exceeds 5MB')

    const fileName = new Date().getTime() + '-' + textFile.name
    const filePath = path.join(
      __dirname,
      '../../../public/uploads/' + `${fileName}`
    )
    const file = {
      name: fileName,
      path: '/uploads/' + fileName,
      uploadedBy: userId
    }
    await textFile.mv(filePath)
    return file
  }

  async create(req: Lesson): Promise<LessonResponse> {
    const lesson = new Lesson(req)
    const { instructor, student, date } = await this.getProps(lesson)
    if (!instructor || !student || !date)
      throw new BadRequestError('Mismatch in provided IDs')

    if (date.busy)
      throw new ConflictError(
        'A lesson is already booked for the requested schedule'
      )

    const createLesson = await this.mongoRepo.save(lesson)
    date.busy = true
    await this.instructorUseCase.updateSchedule(lesson.instructorId, date)

    const response: LessonResponse = {
      id: createLesson.id!,
      instructor: { id: instructor.id!, name: instructor.name },
      student: { id: student.id!, name: student.name },
      lesson_date: { id: date._id!, date: date.date! },
      files: createLesson.files
    }
    return response
  }

  async uploadFile(req: {
    lessonId: string
    userId: string
    textFile: UploadedFile | UploadedFile[]
  }): Promise<void> {
    if (!req.textFile) throw new BadRequestError('No file was uploaded')

    if (Object.keys(req.textFile)[0] === '0') {
      for (const doc of Object.values(req.textFile)) {
        const file = await this.handleFile(doc, req.userId)
        await this.mongoRepo.uploadFile(req.lessonId, file)
      }
      return
    }
    const file = await this.handleFile(req.textFile as UploadedFile, req.userId)
    await this.mongoRepo.uploadFile(req.lessonId, file)
  }

  async listOne(id: string): Promise<LessonResponse> {
    const lesson = await this.mongoRepo.findById(id)
    if (!lesson) throw new NotFoundError(`Lesson not found`)
    const { instructor, student, date } = await this.getProps(lesson)

    const files = []
    for (const item of lesson.files) {
      const file = {
        id: item.id,
        name: item.name,
        path: item.path,
        uploadedBy: item.uploadedBy
      }
      files.push(file)
    }

    const response: LessonResponse = {
      id: lesson.id!,
      instructor: { id: instructor.id!, name: instructor.name },
      student: { id: student.id!, name: student.name },
      lesson_date: { id: date._id!, date: date.date! },
      files: files
    }
    return response
  }

  async listAll(): Promise<LessonResponse[]> {
    const lessons = await this.mongoRepo.findAll()
    const response: LessonResponse[] = []
    for (const lesson of lessons) {
      const { instructor, student, date } = await this.getProps(lesson)
      if (!instructor || !student || !date) continue

      const files = []
      for (const item of lesson.files) {
        const file = {
          id: item.id,
          name: item.name,
          path: item.path,
          uploadedBy: item.uploadedBy
        }
        files.push(file)
      }

      const result: LessonResponse = {
        id: lesson.id!,
        instructor: { id: instructor.id!, name: instructor.name },
        student: { id: student.id!, name: student.name },
        lesson_date: { id: date._id!, date: date.date! },
        files: files
      }
      response.push(result)
    }
    return response
  }

  async delete(id: string): Promise<void> {
    const lesson = await this.mongoRepo.findById(id)

    if (!lesson) throw new NotFoundError('Lesson not found')

    const { date } = await this.getProps(lesson)
    if (date) {
      date.busy = false
      await this.instructorUseCase.updateSchedule(lesson.instructorId, date)
    }
    await this.mongoRepo.delete(id)
  }
}
