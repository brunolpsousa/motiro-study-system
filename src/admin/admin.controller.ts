import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post
} from '@nestjs/common'
import { AdminService } from './admin.service'
import { Admin } from './dto'

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Post()
  async create(@Body() dto: Admin) {
    return await this.adminService.create(dto)
  }

  @Get(':id')
  async listOne(@Param('id') userId: string) {
    return await this.adminService.listOne(userId)
  }

  @Get()
  async listAll() {
    return await this.adminService.listAll()
  }

  @Patch(':id')
  async update(@Param('id') userId: string, @Body() dto: Admin) {
    return await this.adminService.update(userId, dto)
  }

  @Delete(':id')
  async delete(@Param('id') userId: string) {
    return await this.adminService.delete(userId)
  }
}
