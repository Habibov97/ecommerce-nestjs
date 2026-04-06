import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import { UserService } from 'src/modules/user/user.service';
import { JwtAuthPayload } from './auth-guard.types';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const authorization = request.headers.authorization || '';

    const token = authorization.split(' ')[1];

    try {
      const payload = this.jwtService.verify<JwtAuthPayload>(token);
      if (!payload.userId) throw new Error();

      const user = await this.userService.userById(payload.userId);
      if (!user) throw new Error();

      return true;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new UnauthorizedException();
    }
  }
}
