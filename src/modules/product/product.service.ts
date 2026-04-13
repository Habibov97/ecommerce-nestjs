import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpsertProductVariantDto } from './dto/upsert-variant.product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import slugify from 'slugify';
import { UpsertProductSpecDto } from './dto/upsert-specs-product.dto';
import { GetProductListDto } from './dto/get-product-list.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  list(params: GetProductListDto) {
    const where: Prisma.ProductWhereInput = {};

    if (params.category) {
      where.categories = {
        some: {
          id: {
            in: params.category,
          },
        },
      };
    }

    if (params.minPrice || params.maxPrice || params.filters) {
      where.variants = {
        some: {
          ...(params.minPrice || params.maxPrice
            ? {
                price: {
                  ...(params.minPrice && { gte: params.minPrice }),
                  ...(params.maxPrice && { lte: params.maxPrice }),
                },
              }
            : {}),
          ...(params.filters && {
            AND: Object.entries(params.filters).map(([key, value]) => ({
              specs: {
                some: { key, value },
              },
            })),
          }),
        },
      };
    }

    return this.prisma.product.findMany({
      where,
      include: { categories: true, variants: { include: { specs: true } } },
    });
  }

  async item(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        specs: { include: { values: true } },
        variants: { include: { specs: true } },
      },
    });
    if (!product) throw new NotFoundException('Product does not exists');

    return product;
  }

  createProduct(params: CreateProductDto) {
    const categories = params.categories.map((categoryId) => ({
      id: categoryId,
    }));

    return this.prisma.product.create({
      data: {
        ...params,
        categories: { connect: categories },
        specs: {
          create: params.specs.map((spec) => ({
            ...spec,
            values: { create: spec.values },
          })),
        },
      },
      include: {
        categories: true,
        specs: { include: { values: true } },
      },
    });
  }

  async updateProduct(id: number, params: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        categories: { select: { id: true } },
        specs: { include: { values: true } },
      },
    });
    if (!product) throw new NotFoundException('Product is not found!');

    if (!params.slug && params.title) {
      params.slug = slugify(params.title, { lower: true });
    }

    const categories = params.categories?.map((item) => {
      return { id: item };
    });

    return this.prisma.product.update({
      where: { id },
      data: {
        ...params,
        categories: categories && {
          disconnect: product.categories,
          connect: categories,
        },
      },
    });
  }

  async upsertProductSpec(id: number, params: UpsertProductSpecDto) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        specs: { include: { values: true } },
      },
    });
    if (!product) throw new NotFoundException('Product does not found!');

    const productSpec = product.specs.find((item) => item.key === params.key);

    if (!productSpec) {
      await this.prisma.productSpec.create({
        data: {
          ...params,
          productId: product.id,
          values: { create: params.values },
        },
      });
      return {
        message: 'Product spec created successfully',
      };
    } else {
      await this.prisma.productSpec.update({
        where: { id: productSpec.id },
        data: {
          ...params,
          values: { deleteMany: {}, create: params.values },
        },
      });

      return {
        message: 'Product spec updated successfully',
      };
    }
  }

  async deleteProductSpec(id: number, specKey: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        specs: {
          include: { values: true },
        },
      },
    });
    if (!product) throw new NotFoundException('Product is not found');

    const spec = product.specs.find((spec) => spec.key === specKey);
    if (!spec) throw new NotFoundException('Spec is not found!');

    await this.prisma.productSpec.delete({ where: { id: spec.id } });

    return {
      message: 'Spec deleted successfully',
    };
  }

  async deleteProduct(id: number) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product is not found');

    await this.prisma.product.delete({ where: { id } });

    return {
      message: 'Product has been deleted successfully!',
    };
  }

  async upsertVariant(id: number, params: UpsertProductVariantDto) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        specs: {
          include: {
            values: true,
          },
        },
        variants: {
          include: {
            specs: true,
          },
        },
      },
    });
    if (!product) throw new NotFoundException('Product not found');

    const productSpecCheck = params.specs.every((spec) => {
      const matchedProductSpec = product.specs.find(
        (item) => item.key === spec.key,
      );

      if (!matchedProductSpec) return false;

      return matchedProductSpec.values.some(
        (value) => value.key === spec.value,
      );
    });

    if (!productSpecCheck)
      throw new BadRequestException('Product spec not found');

    const variantCheck = product.variants.find((productVariant) => {
      return productVariant.specs.every((item) => {
        return params.specs.some((element) => {
          return item.key === element.key && item.value === element.value;
        });
      });
    });

    if (variantCheck) {
      const result = await this.prisma.productVariant.update({
        where: { id: variantCheck.id },
        data: {
          ...params,
          specs: undefined,
        },
      });

      return {
        message: 'Product variant updated successfully',
        data: result,
      };
    } else {
      const result = await this.prisma.productVariant.create({
        data: {
          ...params,
          productId: product.id,
          specs: {
            create: params.specs,
          },
        },
        include: {
          specs: true,
        },
      });

      return {
        message: 'Product variant created successfully',
        data: result,
      };
    }
  }
}
