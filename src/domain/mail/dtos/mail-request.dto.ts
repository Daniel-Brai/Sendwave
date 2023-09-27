import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsString } from 'class-validator';

export class CreateMailContactDto {
  @ApiProperty({
    name: 'name',
    description: 'The name of the mail contact',
    type: String,
    example: 'John',
    required: true,
  })
  @IsString()
  @IsDefined()
  public name!: string;

  @ApiProperty({
    name: 'email',
    description: 'The email of the contact',
    type: String,
    example: 'johndoe@example.com',
    required: true,
  })
  @IsEmail()
  @IsDefined()
  public email!: string;
}

export class CreateMailReportDto {
  @ApiProperty({
    name: 'recipient',
    description: 'The email of the recipient',
    type: String,
    example: 'johndoe@example.com',
    required: true,
  })
  @IsEmail()
  @IsDefined()
  public recipient!: string;

  @ApiProperty({
    name: 'message',
    description: 'The message sent to the recipient',
    type: String,
    required: true,
  })
  @IsString()
  @IsDefined()
  public message!: string;
}
