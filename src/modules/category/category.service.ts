import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateCategoryDto,
  CreateCategoryTranslationDto,
} from './dto/create-category.dto';

import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryWithChildren } from './category.types';
import { Category } from '@prisma/client';
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

    const translations = await this.createTranslations(
      category,
      params.translations,
    );

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

  async update(id: number, params: UpdateCategoryDto) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        translations: true,
      },
    });
    if (!category) throw new NotFoundException('Category not found');

    if (params.translations) {
      await this.prisma.category.deleteMany({
        where: {
          id: {
            in: category.translations.map((data) => data.id),
          },
        },
      });

      const translations = await this.createTranslations(
        category,
        params.translations,
      );

      await this.prisma.category.update({
        where: { id: category.id },
        data: {
          ...params,
          translations: {
            connect: translations,
          },
        },
      });
    } else {
      await this.prisma.category.update({
        where: { id: category.id },
        data: {
          ...params,
          translations: undefined,
        },
      });
    }
  }

  createTranslations(
    category: Category,
    translations: CreateCategoryTranslationDto[],
  ) {
    const locales: any = [];

    for (const translation of translations) {
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
    const result = this.prisma.translation.createManyAndReturn({
      data: locales,
    });

    return result;
  }

  async remove(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });
    if (!category) throw new NotFoundException('Category not found');

    await this.prisma.category.delete({ where: { id } });
    await this.prisma.translation.deleteMany({
      where: {
        model: 'category',
        modelId: category.id,
      },
    });

    return {
      message: 'Category deleted successfully',
    };
  }
}
