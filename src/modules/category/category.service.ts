import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import slugify from 'slugify';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryWithChildren } from './category.types';
import { Category } from '@prisma/client';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { ClsService } from 'nestjs-cls';
import { mapTranslation } from 'src/shared/utils/translation.utils';

@Injectable()
export class CategoryService {
  constructor(
    private prisma: PrismaService,
    private cls: ClsService,
  ) {}

  async list() {
    const lang = this.cls.get('lang');
    const list = await this.prisma.category.findMany({
      include: {
        translations: {
          where: {
            model: 'category',
            lang: lang,
          },
        },
      },
    });

    const modifiedList = list.map((item) => mapTranslation(item));
    console.log(modifiedList);

    const rootCategories = modifiedList.filter(
      (category) => !category.parentId,
    );

    return rootCategories.map((category) =>
      this.childCategories(modifiedList, category),
    );
  }

  childCategories(
    modifiedList: Category[],
    category: Category,
  ): CategoryWithChildren {
    const children = modifiedList
      .filter((item) => item.parentId === category.id)
      .map((item) => this.childCategories(modifiedList, item));
    return {
      ...category,
      children: children.length ? children : undefined,
    };
  }

  async create(params: CreateCategoryDto) {
    const category = await this.prisma.category.create({
      data: {
        parentId: params.parentId,
      },
      include: {
        translations: true,
      },
    });

    const locales: any = [];

    for (const translation of params.translations) {
      locales.push({
        model: 'category',
        modelId: category.id,
        field: 'name',
        value: translation.name,
        lang: translation.lang,
      });

      locales.push({
        model: 'category',
        modelId: category.id,
        field: 'slug',
        value: translation.slug,
        lang: translation.lang,
      });
    }
    const translations = await this.prisma.translation.createManyAndReturn({
      data: locales,
    });

    await this.prisma.category.update({
      where: { id: category.id },
      data: {
        translations: {
          connect: translations,
        },
      },
    });

    category.translations = translations;

    return category;
  }

  // async update(id: number, params: UpdateCategoryDto) {
  //   const category = await this.prisma.category.findUnique({
  //     where: { id },
  //   });
  //   if (!category) throw new NotFoundException('Category not found');

  //   if (!params.slug) {
  //     params.slug = slugify(params.name!, { lower: true });
  //   }

  //   return this.prisma.category.update({
  //     where: { id },
  //     data: { ...params },
  //   });
  // }

  // async remove(id: number) {
  //   const category = await this.prisma.category.findUnique({
  //     where: { id },
  //   });
  //   if (!category) throw new NotFoundException('Category not found');

  //   await this.prisma.category.delete({ where: { id } });

  //   return {
  //     message: 'Category deleted successfully',
  //   };
  // }
}
