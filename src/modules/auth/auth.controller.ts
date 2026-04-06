import { Body, Controller, Post } from '@nestjs/common';
import { UserRegisterDto } from './dto/register-user.dto';
import { AuthService } from './auth.service';
import { UserLoginDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() body: UserLoginDto) {
    return this.authService.login(body);
  }

  @Post('register')
  register(@Body() body: UserRegisterDto) {
    return this.authService.register(body);
  }
}
