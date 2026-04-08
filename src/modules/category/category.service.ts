import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import slugify from 'slugify';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  list() {
    return this.prisma.category.findMany();
  }

  async create(params: CreateCategoryDto) {
    const checkCategory = await this.prisma.category.findUnique({
      where: { name: params.name },
    });
    if (checkCategory) throw new ConflictException('Category already exists');

    if (!params.slug) {
      params.slug = slugify(params.name, { lower: true });
    }

    return this.prisma.category.create({
      data: { ...params },
    });
  }

  async update(id: number, params: UpdateCategoryDto) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });
    if (!category) throw new NotFoundException('Category not found');

    if (!params.slug) {
      params.slug = slugify(params.name!, { lower: true });
    }

    return this.prisma.category.update({
      where: { id },
      data: { ...params },
    });
  }

  async remove(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });
    if (!category) throw new NotFoundException('Category not found');

    await this.prisma.category.delete({ where: { id } });

    return {
      message: 'Category deleted successfully',
    };
  }
}
