import { Module } from '@nestjs/common'
import { LessonUseCase } from '@usecases'
import { LessonController } from '@controllers'
import { LessonRepository } from '@repositories'
import { MongoLessonRepository } from '@mongo'

@Module({
  imports: [],
  controllers: [LessonController],
  providers: [LessonUseCase, LessonRepository as any, MongoLessonRepository]
})
export class LessonModule {}
