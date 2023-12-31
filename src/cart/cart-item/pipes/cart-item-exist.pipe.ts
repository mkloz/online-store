import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { IDDto } from '@shared/dto/id.dto';
import { PrismaService } from '@db/prisma.service';

@Injectable()
export class CartItemExistPipe implements PipeTransform {
  constructor(private readonly prisma: PrismaService) {}

  async transform(value: IDDto) {
    const name = await this.prisma.cartItem.findUnique({
      where: { id: value.id },
    });
    if (!name) throw new BadRequestException('Item does not exist');

    return value;
  }
}
