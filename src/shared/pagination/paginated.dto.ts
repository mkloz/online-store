import { ApiProperty } from '@nestjs/swagger';
import { DEFAULT_ITEMS_LIMIT } from './pagination-options.dto';

class PaginationMeta {
  @ApiProperty({ example: 1 })
  itemCount: number;

  @ApiProperty({ example: 1 })
  totalItems: number;

  @ApiProperty({ example: DEFAULT_ITEMS_LIMIT })
  itemsPerPage: number;

  @ApiProperty({ example: 1 })
  currentPage: number;
}

class PaginationLinks {
  @ApiProperty({ example: 'http://localhost:3000/api/people?limit=4' })
  first: string;

  @ApiProperty({ example: 'http://localhost:3000/api/people?page=2&limit=4' })
  previous: string | null;

  @ApiProperty({ example: 'http://localhost:3000/api/people?page=4&limit=4' })
  next: string | null;

  @ApiProperty({ example: 'http://localhost:3000/api/people?page=21&limit=4' })
  last: string;
}

export class Paginated<TData extends object> {
  @ApiProperty()
  items: TData[];
  @ApiProperty()
  meta: PaginationMeta;
  @ApiProperty()
  links: PaginationLinks;
}
