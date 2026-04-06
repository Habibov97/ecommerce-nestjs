import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class UserRegisterDto {
  @Type()
  @IsEmail()
  @ApiProperty({ default: 'necef.habibov@gmail.com' })
  email: string;

  @Type()
  @IsString()
  @MinLength(6)
  @ApiProperty({ default: 'minlength6chars' })
  password: string;
}
