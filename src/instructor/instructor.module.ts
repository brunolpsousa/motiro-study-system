import { Module } from '@nestjs/common'
import { InstructorUseCase } from '@usecases'
import { InstructorController } from '@controllers'
import { InstructorRepository } from '@repositories'
import { MongoInstructorRepository } from '@mongo'

@Module({
  imports: [],
  controllers: [InstructorController],
  providers: [
    InstructorUseCase,
    InstructorRepository as any,
    MongoInstructorRepository
  ]
})
export class InstructorModule {}
