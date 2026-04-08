import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class CreateCategoryDto {
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
  slug?: string;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  @ApiProperty({ default: null, required: false })
  parentId: number;
}
