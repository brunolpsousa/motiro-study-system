import { Request, Response } from 'express'
import { LessonUseCase } from 'applications/usecases/lessonUseCase'
import { UploadedFile } from 'express-fileupload'
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError
} from 'domain/entities'

export class LessonController {
  constructor(private useCase: LessonUseCase) {}
  async create(req: Request, res: Response) {
    const { instructorId, studentId, dateId } = req.body

    const result = await this.useCase.create({
      instructorId,
      studentId,
      dateId,
      files: []
    })

    return res.status(201).json(result)
  }

  async uploadFile(req: Request, res: Response) {
    const id = req.params?.id
    if (!id) throw new BadRequestError('Invalid ID')

    const userId = req.body.user?.id
    if (!userId) throw new UnauthorizedError('Invalid authentication')

    const lesson = await this.useCase.listOne(id)
    if (!lesson) throw new NotFoundError('Lesson not found')

    const isInstructor = userId === lesson.instructor.id?.toString()
    const isStudent = userId === lesson.student.id?.toString()
    const isAdmin = req.body.user?.role === 'admin'
    if (!isInstructor && !isStudent && !isAdmin)
      throw new ForbiddenError('Access denied')

    if (!req.files || !req.files?.document)
      throw new BadRequestError('No file was uploaded')

    const textFile: UploadedFile | UploadedFile[] = req.files.document

    await this.useCase.uploadFile({
      lessonId: id,
      userId: req.body.user?.id,
      textFile: textFile
    })

    return res.status(200).send()
  }

  async listOne(req: Request, res: Response) {
    const id = req.params?.id
    const result = await this.useCase.listOne(id)

    if (req.body.user?.role !== 'admin') {
      const checkInstructor =
        result.instructor.id.toString() === req.body.user?.id
      const checkStudent = result.student.id?.toString() === req.body.user?.id
      if (!(checkStudent || checkInstructor))
        throw new ForbiddenError('Access denied')
    }

    return res.status(200).json(result)
  }

  async listAll(_: Request, res: Response) {
    const result = await this.useCase.listAll()
    return res.status(200).json(result)
  }

  async delete(req: Request, res: Response) {
    const id = req.params.id
    await this.useCase.delete(id)
    return res.status(200).send()
  }
}
