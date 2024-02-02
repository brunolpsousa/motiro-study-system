import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AdminUseCase } from '@usecases'
import { AdminController } from '@controllers'
import { AdminRepository } from '@repositories'
import { MongoAdminRepository } from '@mongo'

@Module({
  imports: [],
  controllers: [AppController, AdminController],
  providers: [
    AppService,
    AdminUseCase,
    AdminRepository as any,
    MongoAdminRepository
  ]
})
export class AppModule {}
