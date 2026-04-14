import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

class CreateCategoryTranslationDto {
  @Type()
  @IsString()
  @MinLength(3)
  @ApiProperty({ default: 'Electronics' })
  name: string;

  @Type()
  @IsString()
  @MinLength(3)
  @IsOptional()
  @ApiProperty({ default: 'electronics' })
  slug: string;

  @Type()
  @IsString()
  @ApiProperty({ default: 'az', required: true })
  lang: string;
}

export class CreateCategoryDto {
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  @ApiProperty({ default: null, required: false })
  parentId: number;

  @Type(() => CreateCategoryTranslationDto)
  @IsArray()
  @ValidateNested({ each: true })
  @ApiProperty({ type: CreateCategoryTranslationDto, isArray: true })
  translations: CreateCategoryTranslationDto[];
}
