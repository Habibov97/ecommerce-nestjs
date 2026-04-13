import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

import {
  IsArray,
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  Min,
} from 'class-validator';

export class GetProductListDto {
  @Transform(({ value }) => value?.split(',').map((item) => +item))
  @IsNumber({}, { each: true })
  @IsArray()
  @IsOptional()
  @ApiProperty({ default: '1,2', type: String, required: false })
  category: number[];

  @Type()
  @IsInt()
  @Min(1)
  @IsOptional()
  @ApiProperty({ default: 1, required: false })
  minPrice: number;

  @Type()
  @IsInt()
  @Min(1)
  @IsOptional()
  @ApiProperty({ default: 1, required: false })
  maxPrice: number;

  @Transform(({ value }) =>
    value
      ? Object.fromEntries(
          value.split(',').map((item: string) => item.split(':')),
        )
      : undefined,
  )
  @IsObject()
  @IsOptional()
  @ApiProperty({ default: 'color:red,size:m', type: String, required: false })
  filters: Record<string, string>;
}
