import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateSaleDto } from '../dto/create-sale.dto';
import { UpdateSaleDto } from '../dto/update-sale.dto';
import { PrismaService } from '@db/prisma.service';
import {
  IPag,
  Paginated,
  PaginationOptionsDto,
  Paginator,
} from '@shared/pagination';
import { Sale } from '../entities/sale.entity';
import { ApiConfigService } from '@config/api-config.service';
import { GLOBAL_PREFIX, Prefix } from '@utils/prefix.enum';

@Injectable()
export class SaleService {
  private readonly backendUrl: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly cs: ApiConfigService,
  ) {
    this.backendUrl = this.cs.getOnlineStore().backendUrl;
  }

  static saleNotExistException = new UnprocessableEntityException(
    'Sale not exist',
  );

  public async create(dto: CreateSaleDto): Promise<Sale> {
    const sale = await this.prisma.sale.create({
      data: {
        newPrise: dto.newPrise,
        activeTill: dto.activeTill,
        articleId: dto.article,
      },
      include: { article: true },
    });

    if (!sale) throw SaleService.saleNotExistException;

    return new Sale(sale);
  }

  async findAll(opt: PaginationOptionsDto): Promise<Paginated<Sale>> {
    const pag: IPag<Sale> = {
      data: (
        await this.prisma.sale.findMany({
          take: opt.limit,
          skip: opt.limit * (opt.page - 1),
          include: { article: true },
        })
      ).map((el) => new Sale(el)),
      count: await this.prisma.sale.count(),
      route: `${this.backendUrl}/${GLOBAL_PREFIX}/${Prefix.SALES}`,
    };

    return Paginator.paginate(pag, opt);
  }

  public async findOne(id: number): Promise<Sale> {
    const sale = await this.prisma.sale.findUnique({
      where: { id },
      include: { article: true },
    });

    if (!sale) throw SaleService.saleNotExistException;

    return new Sale(sale);
  }

  public async update(id: number, dto: UpdateSaleDto): Promise<Sale> {
    const sale = await this.prisma.sale.update({
      where: { id },
      data: dto,
      include: { article: true },
    });

    if (!sale) throw SaleService.saleNotExistException;

    return new Sale(sale);
  }

  public async remove(id: number): Promise<Sale> {
    const sale = await this.prisma.sale.delete({ where: { id } });

    if (!sale) throw SaleService.saleNotExistException;

    return new Sale(sale);
  }
}
