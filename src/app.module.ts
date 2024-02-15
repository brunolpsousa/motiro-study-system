import { Module } from '@nestjs/common'
import { UserModule } from 'user'
import { LessonModule } from 'lesson'
import { MongoModule } from 'mongo'
import { AuthModule } from 'auth'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    LessonModule,
    MongoModule,
    AuthModule
  ]
})
export class AppModule {}
