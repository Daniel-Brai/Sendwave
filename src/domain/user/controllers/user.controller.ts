import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  Version,
  ParseFilePipeBuilder,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiCookieAuth,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnprocessableEntityResponse,
  ApiProperty,
} from '@nestjs/swagger';
import { PageOptionsDto } from '@common/dtos';
import {
  NO_ENTITY_FOUND,
  UNAUTHORIZED_REQUEST,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
} from '@common/constants';
import {
  ForgetPasswordDto,
  ResetPasswordDto,
  UpdateUserDto,
  UserSignupDto,
  VerifyUserOtpDto,
} from '../dtos/user-request.dto';
import { UserService } from '../services/user.service';
import { AuthenticatedGuard } from '../../authentication/guards/authenticated.guard';
import { LocalGuard } from '../../authentication/guards/local-authentication.guard';

@ApiTags('Users')
@Controller('api/v1/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthenticatedGuard)
  @HttpCode(HttpStatus.OK)
  @ApiProperty({
    name: 'Update user',
    description: 'Update a user by id provided',
    example: {
      param: {
        userId: 'd6a7e8a2-5e1d-4c94-96ea-ef5f8c3f8e32',
      },
    },
    required: true,
  })
  @ApiCreatedResponse({
    description: 'User updated successfully',
  })
  @ApiOkResponse({ description: 'User updated successfully' })
  @ApiOperation({
    summary: 'Update a user by id',
    description: 'Returns an updated user',
  })
  @ApiConsumes('application/json')
  @ApiBody({
    description: 'The parameters provided by user to update their details',
    type: UserSignupDto,
    required: true,
  })
  @ApiParam({ name: 'userId', type: String, required: true })
  @Put('/:userId')
  public async updateUser(
    @Param('userId') userId: string,
    @Body() body: UpdateUserDto,
  ) {
    return await this.userService.updateOneById(userId, body);
  }

  @HttpCode(HttpStatus.FOUND)
  @ApiProperty({
    name: 'Get user',
    description: 'Get a user with id provided',
    example: {
      param: {
        userId: 'd6a7e8a2-5e1d-4c94-96ea-ef5f8c3f8e32',
      },
    },
    required: true,
  })
  @ApiOkResponse({ description: 'User returned successfully' })
  @ApiOperation({
    summary: 'Find user by id',
    description: 'Returns a user',
  })
  @ApiParam({
    name: 'userId',
    description: 'The id provided by the user',
    type: String,
    required: true,
  })
  @ApiConsumes('application/json')
  @Get('/:userId')
  public async findUserById(@Param('userId') userId: string) {
    return await this.userService.findOneById(userId);
  }

  @UseGuards(AuthenticatedGuard)
  @HttpCode(HttpStatus.OK)
  @ApiProperty({
    name: 'Get users',
    description: 'Get a paginated view of users',
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
  @ApiOkResponse({ description: 'Users returned successfully' })
  @ApiOperation({
    summary: 'Get all users',
    description: 'Returns a paginated view of users',
  })
  @ApiOkResponse({
    description: 'Returns a list of users',
  })
  @ApiConsumes('application/json')
  @ApiQuery({
    name: 'pagination_query',
    description: 'The parameters passed to the query',
    type: PageOptionsDto,
    required: true,
  })
  @ApiConsumes('application/json')
  @Get()
  public async findAllUsers(
    @Query('pagination_query') pagination_query: PageOptionsDto,
  ) {
    return await this.userService.findAll(pagination_query);
  }

  @UseGuards(LocalGuard)
  @HttpCode(HttpStatus.OK)
  @ApiProperty({
    title: 'Verify OTP',
    description: 'Verify OTP code provided by the user',
    example: {
      param: {
        userId: 'd6a7e8a2-5e1d-4c94-96ea-ef5f8c3f8e32',
      },
      body: {
        otp_code: '453901',
      },
    },
    required: true,
  })
  @ApiNotFoundResponse({ description: NO_ENTITY_FOUND })
  @ApiForbiddenResponse({ description: UNAUTHORIZED_REQUEST })
  @ApiUnprocessableEntityResponse({ description: BAD_REQUEST })
  @ApiInternalServerErrorResponse({ description: INTERNAL_SERVER_ERROR })
  @ApiOkResponse({ description: 'User verification returned successfully' })
  @ApiOperation({
    summary: 'Verify otp code for a user',
    description: 'Return a message for a verified user',
  })
  @ApiOkResponse({
    description: 'Returns a verification message',
  })
  @ApiBody({
    description: 'The parameters provided to verify an otp',
    type: VerifyUserOtpDto,
    required: true,
  })
  @ApiParam({
    name: 'userId',
    description: 'The id provided by the user',
    type: String,
    required: true,
  })
  @ApiConsumes('application/json')
  @Get('/:userId/verify-otp')
  public async verifyUserOtp(
    @Param('userId') userId: string,
    @Body() body: VerifyUserOtpDto,
  ) {
    return await this.userService.verifyOtpById(userId, body);
  }

  @HttpCode(HttpStatus.OK)
  @ApiProperty({
    title: 'Forget password',
    description: 'Forget a user password by email',
    example: {
      body: {
        email: 'johndoe@gmail.com',
      },
    },
    required: true,
  })
  @ApiNotFoundResponse({ description: NO_ENTITY_FOUND })
  @ApiForbiddenResponse({ description: UNAUTHORIZED_REQUEST })
  @ApiUnprocessableEntityResponse({ description: BAD_REQUEST })
  @ApiInternalServerErrorResponse({ description: INTERNAL_SERVER_ERROR })
  @ApiOkResponse({
    description: 'Otp for forgot password returned successfully',
  })
  @ApiOperation({
    summary: 'Forget password for user with otp code',
    description: 'Return a message for a verified user',
  })
  @ApiOkResponse({
    description: 'Returns a verification message',
  })
  @ApiBody({
    description: 'The parameters provided by user that forgot their password',
    type: ForgetPasswordDto,
    required: true,
  })
  @ApiConsumes('application/json')
  @Post('/forgot-password')
  public async forgetPassword(@Body() body: ForgetPasswordDto) {
    return await this.userService.forgetPassword(body);
  }

  @UseGuards(AuthenticatedGuard)
  @HttpCode(HttpStatus.OK)
  @ApiProperty({
    title: 'Reset password',
    description: 'Reset a user password by old password and new password',
    example: {
      param: {
        userId: 'd6a7e8a2-5e1d-4c94-96ea-ef5f8c3f8e32',
      },
      body: {
        email: 'johndoe@gmail.com',
        password: 'AnyTypePassword%91998',
        password_update: {
          old_password: 'AnyTypePassword%91998',
          new_password: 'MyNewPassword%91998',
          new_password_confirmation: 'MyNewPassword%91998',
        },
      },
    },
    required: true,
  })
  @ApiNotFoundResponse({ description: NO_ENTITY_FOUND })
  @ApiForbiddenResponse({ description: UNAUTHORIZED_REQUEST })
  @ApiUnprocessableEntityResponse({ description: BAD_REQUEST })
  @ApiInternalServerErrorResponse({ description: INTERNAL_SERVER_ERROR })
  @ApiOkResponse({ description: 'User returned successfully' })
  @ApiOperation({
    summary: 'Reset password',
    description: 'Return a message for user',
  })
  @ApiOkResponse({
    description: 'Returns a verification message',
  })
  @ApiParam({
    name: 'userId',
    description: 'The id provided by the user',
    type: String,
    required: true,
  })
  @ApiBody({
    description: 'The paramaters provided by the user to reset their password',
    type: ResetPasswordDto,
    required: true,
  })
  @ApiConsumes('application/json')
  @Post('/:userId/reset-password')
  public async resetPassword(
    @Param('userId') userId: string,
    @Body() body: ResetPasswordDto,
  ) {
    return await this.userService.resetPassword(userId, body);
  }

  @UseGuards(AuthenticatedGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiProperty({
    title: 'Delete user',
    description: 'Delete an account with the user id passed',
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
  @ApiOkResponse({ description: 'User removed successfully' })
  @ApiOperation({
    summary: 'Delete a user by id',
    description: 'Deletes a user account',
  })
  @ApiOkResponse({
    description: 'Returns no content',
  })
  @ApiParam({
    name: 'userId',
    description: 'The id provided by the user',
    type: String,
    required: true,
  })
  @ApiConsumes('application/json')
  @Delete('/:userId')
  public async deleteUser(@Param('userId') userId: string) {
    return await this.userService.deleteOneById(userId);
  }
}
