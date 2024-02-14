import { Module } from '@nestjs/common'
import { UserModule } from 'user'
import { LessonModule } from 'lesson'
import { MongoModule } from 'mongo'

@Module({
  imports: [UserModule, LessonModule, MongoModule],
  controllers: [],
  providers: []
})
export class AppModule {}
