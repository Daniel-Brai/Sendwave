import { IPageMetaParams } from '@common/interfaces';
import { Order } from '@common/types';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsPositive,
  Min,
  Max,
} from 'class-validator';

export class PageOptionsDto {
  @IsOptional()
  readonly order?: Order;

  @Min(1)
  @IsInt()
  @IsPositive()
  @IsOptional()
  readonly page?: number;

  @Max(50)
  @Min(1)
  @IsInt()
  @IsPositive()
  @IsOptional()
  readonly take?: number;

  get skip(): number {
    return (this.page - 1) * this.take;
  }

  constructor() {
    this.page = 1;
    (this.take = 10), (this.order = 'DESC');
  }
}

export class PageMetaDto {
  readonly page: number;
  readonly take: number;
  readonly itemCount: number;
  readonly pageCount: number;
  readonly hasPreviousPage: boolean;
  readonly hasNextPage: boolean;

  constructor({ pageOptionsDto, itemCount }: IPageMetaParams) {
    this.page = pageOptionsDto.page;
    this.take = pageOptionsDto.take;
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(this.itemCount / this.take);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;
  }
}

export class PageDto<T> {
  @IsArray()
  readonly data: T[];

  readonly meta: PageMetaDto;

  constructor(data: T[], meta: PageMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
