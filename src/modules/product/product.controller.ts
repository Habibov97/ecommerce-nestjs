import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Auth } from 'src/shared/decorators/auth.decorator';
import { CreateProductDto } from './dto/create-product.dto';
import { UpsertProductVariantDto } from './dto/upsert-variant.product.dto';
import { UserRole } from '@prisma/client';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpsertProductSpecDto } from './dto/upsert-specs-product.dto';
import { GetProductListDto } from './dto/get-product-list.dto';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  list(@Query() query: GetProductListDto) {
    return this.productService.list(query);
  }

  @Get(':id')
  item(@Param('id') id: number) {
    return this.productService.item(id);
  }

  @Post()
  @Auth(UserRole.ADMIN)
  createProduct(@Body() body: CreateProductDto) {
    return this.productService.createProduct(body);
  }

  @Patch(':id')
  @Auth(UserRole.ADMIN)
  updateProduct(@Param('id') id: number, @Body() body: UpdateProductDto) {
    return this.productService.updateProduct(id, body);
  }

  @Patch(':id/spec/:specKey')
  @Auth(UserRole.ADMIN)
  upsertProductSpec(
    @Param('id') id: number,
    @Body() body: UpsertProductSpecDto,
  ) {
    return this.productService.upsertProductSpec(id, body);
  }

  @Delete(':id/spec/:specKey')
  @Auth(UserRole.ADMIN)
  deleteProductSpec(
    @Param('id') id: number,
    @Param('specKey') specKey: string,
  ) {
    return this.productService.deleteProductSpec(id, specKey);
  }

  @Delete(':id')
  @Auth(UserRole.ADMIN)
  deleteProduct(@Param('id') id: number) {
    return this.productService.deleteProduct(id);
  }

  @Post(':id/variant')
  @Auth(UserRole.ADMIN)
  upsertVariant(
    @Param('id') id: number,
    @Body() body: UpsertProductVariantDto,
  ) {
    return this.productService.upsertVariant(id, body);
  }
}
