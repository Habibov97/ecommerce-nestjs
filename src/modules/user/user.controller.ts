import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':id')
  @ApiBearerAuth()
  async userById(@Param('id') id: number) {
    const user = await this.userService.userById(id);
    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  @Get()
  @ApiBearerAuth()
  users() {
    return this.userService.list();
  }
}
