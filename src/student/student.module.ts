import { Module } from '@nestjs/common'
import { StudentUseCase } from '@usecases'
import { StudentController } from '@controllers'
import { StudentRepository } from '@repositories'
import { MongoStudentRepository } from '@mongo'

@Module({
  imports: [],
  controllers: [StudentController],
  providers: [StudentUseCase, StudentRepository as any, MongoStudentRepository]
})
export class StudentModule {}
