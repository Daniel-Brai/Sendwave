import { ApiResponseProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsUUID } from 'class-validator';

export class UserDataDto {
  @ApiResponseProperty({
    example: 'da9b9f51-23b8-4642-97f7-52537b3cf53b',
    format: 'v4',
  })
  @IsUUID()
  @IsDefined()
  public userId: string;

  @ApiResponseProperty({
    example: 'johndoe@gmail.com',
  })
  @IsDefined()
  @IsEmail()
  public email!: string;
}
