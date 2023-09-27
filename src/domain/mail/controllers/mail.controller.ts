import { Controller, Post } from '@nestjs/common';
import {
  ApiTags,
  ApiBody,
  ApiQuery,
  ApiConsumes,
  ApiOkResponse,
} from '@nestjs/swagger';

@ApiTags('Mailer')
@Controller('mailer')
export class MailerController {}
