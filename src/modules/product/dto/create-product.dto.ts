import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';

class CreateProductSpecValue {
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

class CreateProductSpecDto {
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

  @Type(() => CreateProductSpecValue)
  @IsArray()
  @ValidateNested({ each: true })
  @ApiProperty({ type: CreateProductSpecValue, isArray: true })
  values: CreateProductSpecValue[];
}

export class CreateProductDto {
  @Type()
  @IsString()
  @MinLength(1)
  @ApiProperty({ default: 'shoes' })
  title: string;

  @Type()
  @IsString()
  @MinLength(1)
  @ApiProperty({ default: 'shoes' })
  slug: string;

  @Type()
  @IsString()
  @MinLength(3)
  @ApiProperty({ default: 'good quality!' })
  description: string;

  @Type()
  @IsNumber({}, { each: true })
  @IsArray()
  @ApiProperty({ default: [] })
  categories: number[];

  @Type(() => CreateProductSpecDto)
  @ValidateNested({ each: true }) // CreateProductSpecDto nun icindekileri validate edir.
  @IsArray()
  @ApiProperty({ type: CreateProductSpecDto, isArray: true })
  specs: CreateProductSpecDto[];
}
