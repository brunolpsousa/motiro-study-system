import { Lesson } from './dto'
import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  NotFoundException,
  Param,
  Req,
  UnauthorizedException
} from '@nestjs/common'
import { LessonResponse, LessonService } from './lesson.service'
import { UploadedFile } from 'express-fileupload'

@Controller('lesson')
export class LessonController {
  constructor(private useCase: LessonService) {}
  async create(@Body() dto: Lesson) {
    const { instructorId, studentId, dateId } = dto

    return await this.useCase.create({
      instructorId,
      studentId,
      dateId,
      files: []
    })
  }

  async uploadFile(
    @Param('id') id: string,
    @Body() dto: any,
    @Req() req: Express.Request
  ) {
    if (!id) throw new BadRequestException('Invalid ID')

    const userId = dto.user?.id
    if (!userId) throw new UnauthorizedException('Invalid authentication')

    const lesson = await this.useCase.listOne(id)
    if (!lesson) throw new NotFoundException('Lesson not found')

    const isInstructor = userId === lesson.instructor.id?.toString()
    const isStudent = userId === lesson.student.id?.toString()
    const isAdmin = dto.user?.role === 'admin'
    if (!isInstructor && !isStudent && !isAdmin)
      throw new ForbiddenException('Access denied')

    if (!req.files || !req.files?.document)
      throw new BadRequestException('No file was uploaded')

    const textFile: UploadedFile | UploadedFile[] = req.files.document

    await this.useCase.uploadFile({
      lessonId: id,
      userId: dto.user?.id,
      textFile: textFile
    })
  }

  async listOne(@Param('id') id: string, @Body() dto: any) {
    const result = await this.useCase.listOne(id)

    if (dto.user?.role !== 'admin') {
      const checkInstructor = result.instructor.id.toString() === dto.user?.id
      const checkStudent = result.student.id?.toString() === dto.user?.id
      if (!(checkStudent || checkInstructor))
        throw new ForbiddenException('Access denied')
    }

    return result
  }

  async listAll(@Body() dto: any) {
    const lessons = await this.useCase.listAll()
    let result: LessonResponse[] = []

    if (dto.user?.role !== 'admin') {
      for (const lesson of lessons) {
        const checkInstructor = lesson.instructor.id.toString() === dto.user?.id
        const checkStudent = lesson.student.id.toString() === dto.user?.id
        if (checkStudent || checkInstructor) result.push(lesson)
      }
    } else result = lessons

    return result
  }

  async delete(@Param('id') id: string) {
    return await this.useCase.delete(id)
  }
}
