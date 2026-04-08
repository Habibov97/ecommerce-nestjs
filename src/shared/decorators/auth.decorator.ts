import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { Roles } from './role.decorator';
import { UserRole } from '@prisma/client';

export function Auth(...roles: UserRole[]) {
  return applyDecorators(
    UseGuards(AuthGuard),
    Roles(...roles),
    ApiBearerAuth(),
  );
}
