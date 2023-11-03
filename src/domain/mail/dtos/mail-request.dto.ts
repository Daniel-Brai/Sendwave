import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsString, Validate } from 'class-validator';
import {
  MailContext,
  MailServiceProvider,
  MailSchedule,
} from '../mail.constants';

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

export class CreateMailTemplateDto {
  @ApiProperty({
    name: 'name',
    description: 'The name of the mail templates',
    type: String,
    example: 'Basic application templates',
    required: true,
  })
  @IsString()
  @IsDefined()
  public name!: string;

  @ApiProperty({
    name: 'content',
    description: 'The content of the template',
    type: String,
    example: 'Good day {{ name }}! I am writing to ask for inquiry for the position of {{ position }}',
    required: true,
  })
  @IsString()
  @IsDefined()
  public content!: string;
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

export class MailScheduleDto {
  @ApiProperty({
    name: 'schedule',
    description: 'The schedule of the email(s) to be sent',
    example: 'none',
    required: true,
  })
  @IsDefined()
  public schedule!: MailSchedule;
}

export class SendMailDto {
  @ApiProperty({
    name: 'service',
    description: 'The service provider of the email domain',
    type: String,
    example: 'Hotmail',
    required: true,
  })
  @IsString()
  @IsDefined()
  public service!: MailServiceProvider;

  @ApiProperty({
    name: 'email',
    description: 'The user of the email domain',
    type: String,
    example: 'johnnyWalker13@outlook.com',
    required: true,
  })
  @IsEmail()
  @IsDefined()
  public email!: string;

  @ApiProperty({
    name: 'password',
    description: 'The password of the email domain',
    type: String,
    example: 'JohnnyWalker$e20#014',
    required: true,
  })
  @IsString()
  @IsDefined()
  public password!: string;

  @ApiProperty({
    name: 'data',
    description: 'The data to be sent',
    type: Array<MailContext>,
    example: [
      {
        receipient: 'dan@gmail.com',
        message: 'Hi there, I am looking for position at a your company',
      },
    ],
    required: true,
  })
  @Validate(() => Array<MailContext>)
  @IsDefined()
  public data!: Array<MailContext>;
}
