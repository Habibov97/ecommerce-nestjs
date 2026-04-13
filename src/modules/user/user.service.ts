import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/generated/i18n.generated';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private i18n: I18nService<I18nTranslations>,
  ) {}

  userById(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  list() {
    return this.prisma.user.findMany();
  }

  testUpdate() {
    return {
      message: this.i18n.t('user.response.notFound', { args: { id: 5 } }),
    };
  }
}
