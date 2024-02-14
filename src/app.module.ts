import { Module } from '@nestjs/common'
import { UserModule } from 'user'
import { LessonModule } from 'lesson'
import { MongoModule } from 'mongo'
import { AuthModule } from 'auth'

@Module({
  imports: [UserModule, LessonModule, MongoModule, AuthModule]
})
export class AppModule {}
