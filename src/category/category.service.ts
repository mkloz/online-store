import { Injectable } from '@nestjs/common';
import { PaginationOptionsDto } from 'src/common/pagination/pagination-options.dto';
import { Paginated } from 'src/common/pagination/paginated.dto';
import { Category } from './entities/category.entity';
import { PrismaService } from 'src/db/prisma.service';
import { ConfigService } from '@nestjs/config';
import { IPag, Paginator } from 'src/common/pagination/paginator.sevice';
import { EnvVar, IStore } from 'src/common/config/config';

@Injectable()
export class CategoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cs: ConfigService,
  ) {}

  async findAll(opt: PaginationOptionsDto): Promise<Paginated<Category>> {
    const pag: IPag<Category> = {
      data: await this.prisma.category.findMany({
        take: opt.limit,
        skip: opt.limit * (opt.page - 1),
        include: { articles: true },
      }),
      count: await this.prisma.category.count(),
      route: `${
        this.cs.get<IStore>(EnvVar.ONLINE_STORE).projectUrl
      }/api/categories`,
    };

    return Paginator.paginate(pag, opt);
  }

  findOne(id: number) {
    return this.prisma.category.findUnique({
      where: { id },
      include: { articles: true },
    });
  }
}
