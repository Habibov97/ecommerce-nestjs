import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserRegisterDto } from './dto/register-user.dto';
import { UserLoginDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(params: UserLoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: params.email },
    });

    if (!user) throw new UnauthorizedException('User or password is incorrect');

    const isPasswordValid = await bcrypt.compare(
      params.password!,
      user.password,
    );

    if (!isPasswordValid)
      throw new UnauthorizedException('User or password is incorrect');

    const token = this.jwtService.sign({ userId: user.id });

    return {
      data: {
        user: {
          ...user,
          password: undefined,
        },
        token,
      },
    };
  }

  async register(params: UserRegisterDto) {
    const checkUser = await this.prisma.user.findUnique({
      where: { email: params.email },
    });

    if (checkUser) throw new NotFoundException('User already exists');

    params.password = await bcrypt.hash(params.password, 10);

    const user = await this.prisma.user.create({
      data: { ...params },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    return {
      user,
    };
  }
}
