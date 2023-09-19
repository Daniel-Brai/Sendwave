import { Request } from 'express';
import { UserEntity } from '../../domain/user/entities/user.entity';

export interface RequestUser extends Request {
  readonly user: UserEntity;
}

export interface AuthenticatedRequestUser {
  readonly id: string;
  readonly username?: string;
  readonly email: string;
}

export interface PageOptionsDto {
  page?: number;
  take?: number;
  skip?: number;
}

export interface IPageMetaParams {
  pageOptionsDto: PageOptionsDto;
  itemCount: number;
}
