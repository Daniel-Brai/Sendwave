import {
  Controller,
  Get,
  Post,
  Delete,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import {
  ApiTags,
  ApiBody,
  ApiQuery,
  ApiConsumes,
  ApiNotFoundResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiNoContentResponse,
  ApiOperation,
  ApiUnprocessableEntityResponse,
  ApiProperty,
  ApiParam,
} from '@nestjs/swagger';
import { CreateMailContactDto } from '../dtos/mail-request.dto';
import { MailService } from '../services/mail.service';
import { PageOptionsDto } from '@common/dtos';
import {
  NO_ENTITY_FOUND,
  UNAUTHORIZED_REQUEST,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
} from '@common/constants';

@ApiTags('Mail')
@Controller('api/v1/mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @HttpCode(HttpStatus.OK)
  @ApiProperty({
    name: 'Get user mailing contacts',
    description: 'Get a paginated view of user mailing contacts',
    example: {
      query: {
        limit: 50,
        skip: 10,
      },
    },
    required: true,
  })
  @ApiNotFoundResponse({ description: NO_ENTITY_FOUND })
  @ApiForbiddenResponse({ description: UNAUTHORIZED_REQUEST })
  @ApiUnprocessableEntityResponse({ description: BAD_REQUEST })
  @ApiInternalServerErrorResponse({ description: INTERNAL_SERVER_ERROR })
  @ApiOkResponse({ description: 'User mail contacts returned successfully' })
  @ApiOperation({
    summary: 'Get all user mail contacts',
    description: 'Returns a paginated view of mail contacts of a user',
  })
  @ApiOkResponse({
    description: 'Returns a list of user mail contacts',
  })
  @ApiConsumes('application/json')
  @ApiQuery({
    name: 'pagination_query',
    description: 'The parameters passed to the query',
    type: PageOptionsDto,
    required: true,
  })
  @ApiConsumes('application/json')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30)
  @Get('/:userId/contacts')
  public async findUserMailContacts(
    @Param('userId') userId: string,
    @Query('pagination_query') pagination_query: PageOptionsDto,
  ) {
    return await this.mailService.findUserMailContacts(
      userId,
      pagination_query,
    );
  }

  @HttpCode(HttpStatus.OK)
  @ApiProperty({
    name: 'Get mail contacts',
    description: 'Get a paginated view of mail contacts',
    example: {
      query: {
        limit: 50,
        skip: 10,
      },
    },
    required: true,
  })
  @ApiNotFoundResponse({ description: NO_ENTITY_FOUND })
  @ApiForbiddenResponse({ description: UNAUTHORIZED_REQUEST })
  @ApiUnprocessableEntityResponse({ description: BAD_REQUEST })
  @ApiInternalServerErrorResponse({ description: INTERNAL_SERVER_ERROR })
  @ApiOkResponse({ description: 'Mail contacts returned successfully' })
  @ApiOperation({
    summary: 'Get all mail contacts',
    description: 'Returns a paginated view of mail contacts',
  })
  @ApiOkResponse({
    description: 'Returns a list of mail contacts',
  })
  @ApiConsumes('application/json')
  @ApiQuery({
    name: 'pagination_query',
    description: 'The parameters passed to the query',
    type: PageOptionsDto,
    required: true,
  })
  @ApiConsumes('application/json')
  @UseInterceptors(CacheInterceptor)
  @CacheKey('mail-contacts-list')
  @CacheTTL(30)
  @Get('/contacts')
  public async findMailContacts(
    @Query('pagination_query') pagination_query: PageOptionsDto,
  ) {
    return await this.mailService.findMailContacts(pagination_query);
  }

  @HttpCode(HttpStatus.CREATED)
  @ApiProperty({
    title: 'Create a mail contact',
    description: 'Create a mail contact for a user',
    example: {
      params: {
        userId: 'd6a7e8a2-5e1d-4c94-96ea-ef5f8c3f8e32',
      },
      body: {
        name: 'John Pearson',
        email: 'johnpearson@gmail.com',
      },
    },
    required: true,
  })
  @ApiNotFoundResponse({ description: NO_ENTITY_FOUND })
  @ApiForbiddenResponse({ description: UNAUTHORIZED_REQUEST })
  @ApiUnprocessableEntityResponse({ description: BAD_REQUEST })
  @ApiInternalServerErrorResponse({ description: INTERNAL_SERVER_ERROR })
  @ApiOkResponse({ description: 'Mailer contact returned successfully' })
  @ApiOperation({
    summary: 'Create a mail contact',
    description: 'Returns the created mail contact',
  })
  @ApiOkResponse({
    description: 'Returns the created mail contact',
  })
  @ApiBody({
    description: 'The parameters provided to create a mail contact',
    type: CreateMailContactDto,
    required: true,
  })
  @ApiParam({
    name: 'userId',
    description: 'The id of the user that creates the mail contact',
    type: String,
    required: true,
  })
  @ApiConsumes('application/json')
  @Post('/:userId/contacts')
  public async createMailContact(
    @Param('userId') userId: string,
    @Body() body: CreateMailContactDto,
  ) {
    return await this.mailService.createMailContact(userId, body);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiProperty({
    title: 'Delete mail contact',
    description: 'Delete a mail contact with the id passed',
    example: {
      param: {
        userId: 'd6a7e8a2-5e1d-4c94-96ea-ef5f8c3f8e32',
      },
    },
    required: true,
  })
  @ApiNotFoundResponse({ description: NO_ENTITY_FOUND })
  @ApiNoContentResponse({ description: 'Returns no content' })
  @ApiForbiddenResponse({ description: UNAUTHORIZED_REQUEST })
  @ApiUnprocessableEntityResponse({ description: BAD_REQUEST })
  @ApiInternalServerErrorResponse({ description: INTERNAL_SERVER_ERROR })
  @ApiOkResponse({ description: 'Mail contact removed successfully' })
  @ApiOperation({
    summary: 'Delete a mail contact by id',
    description: 'Deletes a mail contact',
  })
  @ApiOkResponse({
    description: 'Returns no content',
  })
  @ApiParam({
    name: 'contactId',
    description: 'The id provided by the contact',
    type: String,
    required: true,
  })
  @ApiConsumes('application/json')
  @Delete('/contacts/:contactId')
  public async deleteMailContact(@Param('contactId') contactId: string) {
    return await this.mailService.deleteMailContact(contactId);
  }
}
