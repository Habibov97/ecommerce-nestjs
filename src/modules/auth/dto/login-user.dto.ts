import { PartialType } from '@nestjs/swagger';
import { UserRegisterDto } from './register-user.dto';

export class UserLoginDto extends PartialType(UserRegisterDto) {}
