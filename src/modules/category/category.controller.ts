import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Auth } from 'src/shared/decorators/auth.decorator';

@Controller('categories')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get()
  list() {
    return this.categoryService.list();
  }

  @Post()
  @Auth('ADMIN')
  create(@Body() body: CreateCategoryDto) {
    return this.categoryService.create(body);
  }

  @Post('/:id')
  @Auth('ADMIN')
  update(@Param('id') id: number, @Body() body: UpdateCategoryDto) {
    return this.categoryService.update(id, body);
  }

  @Delete('/:id')
  @Auth('ADMIN')
  remove(@Param('id') id: number) {
    return this.categoryService.remove(id);
  }
}
