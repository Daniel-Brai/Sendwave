import { ApiResponseProperty } from '@nestjs/swagger';
import { IsDefined, IsString, IsUUID } from 'class-validator';

export class GenerateUserOtpDto {
  @ApiResponseProperty({
    example: 'da9b9f51-23b8-4642-97f7-52537b3cf53b',
    format: 'v4',
  })
  @IsUUID()
  @IsDefined()
  readonly userId: string;

  @ApiResponseProperty({
    example: 'OTP code sent successfully',
  })
  @IsString()
  @IsDefined()
  readonly message: string;
}

export class VerifyMessageDto {
  @ApiResponseProperty({
    example: 'Account verification successful',
  })
  @IsString()
  @IsDefined()
  readonly message: string;
}
