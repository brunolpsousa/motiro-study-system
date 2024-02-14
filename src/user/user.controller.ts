import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post
} from '@nestjs/common'
import { UserService } from './user.service'
import { User } from './dto'
// import { authMiddleware } from 'applications/middlewares/authMiddleware'

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async create(@Body() dto: User) {
    return await this.userService.create(dto)
  }

  @Get(':id')
  async listOne(@Param('id') userId: string, @Body() bodyId: any) {
    // authMiddleware.checkUserPermissions(bodyId, userId)
    return await this.userService.listOne(userId)
  }

  @Get()
  async listAll() {
    return await this.userService.listAll()
  }

  @Patch(':id')
  async update(@Param('id') userId: string, @Body() dto: User) {
    // authMiddleware.checkUserPermissions(dto as any, userId)
    return await this.userService.update(userId, dto)
  }

  @Delete(':id')
  async delete(@Param('id') userId: string, @Body() body: any) {
    // authMiddleware.checkUserPermissions(body, userId)
    return await this.userService.delete(userId)
  }
}
