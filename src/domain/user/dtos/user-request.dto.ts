import { ApiProperty, PartialType } from '@nestjs/swagger';
import { MatchPasswords } from '@common/decorators';
import {
  IsDefined,
  IsEmail,
  IsObject,
  IsOptional,
  IsString,
  IsPhoneNumber,
  Matches,
  MaxLength,
  MinLength,
  Validate,
  ValidateNested,
} from 'class-validator';
import { Type as validateType } from 'class-transformer';

export class UserSignupDto {
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
  @MinLength(4)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Your password is too weak',
  })
  @IsString()
  @IsDefined()
  public password!: string;
}

export class UpdateUserDto extends PartialType<UserSignupDto>(UserSignupDto) {}

export class ResetPassword {
  @ApiProperty({
    description: 'The old password provided by the logged in user',
    example: 'X4dC6>Lnv#5h[G|d%ynRxi9a[k&Lp~',
    required: true,
  })
  @IsString()
  @IsDefined()
  public old_password!: string;

  @ApiProperty({
    description: 'The new password provided by the logged in user',
    example: 'OjspoHHv*c&6@"Ra{:5Hj#1+NPNtrF',
    required: true,
  })
  @MaxLength(40)
  @MinLength(4)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Your password is too weak',
  })
  @IsString()
  @IsDefined()
  public new_password!: string;

  @ApiProperty({
    description: 'The new password provided by the logged in user',
    example: 'OjspoHHv*c&6@"Ra{:5Hj#1+NPNtrF',
    required: true,
  })
  @MinLength(4)
  @MaxLength(40)
  @Validate(MatchPasswords, ['new_password'])
  @IsString()
  @IsDefined()
  public new_password_confirmation!: string;
}

export class ResetPasswordDto extends PartialType<UserSignupDto>(
  UserSignupDto,
) {
  @ApiProperty({
    description: 'The password update provided by the user',
    required: true,
  })
  @IsObject()
  @ValidateNested()
  @validateType(() => ResetPassword)
  @IsOptional()
  public password_update: ResetPassword;
}

export class ForgetPasswordDto {
  @ApiProperty({
    description: 'The email provided by the user who forgot their password',
    example: 'johndoe@gmail.com',
    required: true,
  })
  @IsEmail()
  @IsDefined()
  public email!: string;
}

export class VerifyUserOtpDto {
  @ApiProperty({
    description: 'The otp provided by the user to verify their account',
    example: '123456',
    required: true,
  })
  @MaxLength(6)
  @IsString()
  @IsDefined()
  public otp_code!: string;
}
