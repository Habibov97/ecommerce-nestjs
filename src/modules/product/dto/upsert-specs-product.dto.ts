import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsString, MinLength, ValidateNested } from 'class-validator';

class UpsertProductSpecValue {
  @Type()
  @IsString()
  @MinLength(1)
  @ApiProperty({ default: 'red' })
  key: string;

  @Type()
  @IsString()
  @MinLength(1)
  @ApiProperty({ default: 'Red' })
  value: string;
}

export class UpsertProductSpecDto {
  @Type()
  @IsString()
  @MinLength(1)
  @ApiProperty({ default: 'color' })
  key: string;

  @Type()
  @IsString()
  @MinLength(1)
  @ApiProperty({ default: 'Color' })
  name: string;

  @Type(() => UpsertProductSpecValue)
  @IsArray()
  @ValidateNested({ each: true })
  @ApiProperty({ type: UpsertProductSpecValue, isArray: true })
  values: UpsertProductSpecValue[];
}
