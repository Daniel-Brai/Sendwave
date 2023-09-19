import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsString,
  IsEmail,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
  IsStrongPassword,
} from 'class-validator';

export class UserSignInDto {
  @ApiProperty({
    description: 'The email provided by the user',
    example: 'johndoe@gmail.com',
    required: true,
  })
  @IsEmail()
  @IsDefined()
  public email!: string;

  @ApiProperty({
    description: 'The password provided by the user',
    example: 'X4dC6>Lnv#5h[G|d%ynRxi9a[k&Lp~',
    required: true,
  })
  @MaxLength(40)
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Your password is too weak',
  })
  @IsString()
  @IsDefined()
  public password!: string;
}

export class UserPayloadDto {
  @ApiProperty({
    description: 'The id provided by the user',
    format: 'v4',
    required: true,
  })
  @IsUUID()
  @IsDefined()
  public id!: string;

  @ApiProperty({
    description: 'The email provided by the user',
    example: 'johndoe@gmail.com',
    required: true,
  })
  @IsEmail()
  @IsDefined()
  public email!: string;
}
