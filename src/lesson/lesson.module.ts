import { Module } from '@nestjs/common'
import { LessonService } from './lesson.service'
import { LessonController } from './lesson.controller'

@Module({
  imports: [],
  controllers: [LessonController],
  providers: [LessonService]
})
export class LessonModule {}
