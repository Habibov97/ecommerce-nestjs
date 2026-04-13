import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { UserService } from './user.service';

import { Auth } from 'src/shared/decorators/auth.decorator';
import { UserRole } from '@prisma/client';
import { I18n, I18nContext } from 'nestjs-i18n';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('test')
  test(@I18n() i18n: I18nContext) {
    return {
      message: i18n.t('user.response.created'),
    };
  }

  @Get('test-update')
  testUpdate() {
    return this.userService.testUpdate();
  }

  @Get(':id')
  @Auth(UserRole.ADMIN)
  async userById(@Param('id') id: number) {
    const user = await this.userService.userById(id);
    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  @Get()
  @Auth(UserRole.ADMIN)
  users() {
    return this.userService.list();
  }
}
