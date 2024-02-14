import { Module } from '@nestjs/common'
import { AdminModule } from 'admin'
import { LessonModule } from 'lesson'
import { MongoModule } from 'mongo'

@Module({
  imports: [AdminModule, LessonModule, MongoModule],
  controllers: [],
  providers: []
})
export class AppModule {}
