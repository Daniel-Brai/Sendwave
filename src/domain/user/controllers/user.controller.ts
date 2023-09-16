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
import { AccessTokenGuard } from '../../authentication/guards/access-token.guard';
import { CurrentUser } from '../../authentication/guards/current-user.guard';
import { UserPayloadDto } from '../../authentication/dtos/auth-request.dto';

@ApiCookieAuth('access_token')
@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'User created successfully',
  })
  @ApiOkResponse({ description: 'User created successfully' })
  @ApiOperation({
    summary: 'Create a user',
    description: 'Returns a new user',
  })
  @ApiConsumes('application/json')
  @ApiBody({ type: UserSignupDto, required: true })
  @Version('1')
  @Post()
  public async createUser(@Body() body: UserSignupDto) {
    return await this.userService.create(body);
  }

  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({
    description: 'User updated successfully',
  })
  @ApiOkResponse({ description: 'User updated successfully' })
  @ApiOperation({
    summary: 'Update a user by id',
    description: 'Returns an updated user',
  })
  @ApiConsumes('application/json')
  @ApiBody({ type: UserSignupDto, required: true })
  @ApiParam({ name: 'userId', type: String, required: true })
  @Version('1')
  @Put('/:userId')
  public async updateUser(
    @Param('userId') userId: string,
    @Body() body: UpdateUserDto,
  ) {
    return await this.userService.updateOneById(userId, body);
  }

  @HttpCode(HttpStatus.FOUND)
  @ApiOkResponse({ description: 'User returned successfully' })
  @ApiOperation({
    summary: 'Find user by id',
    description: 'Returns a user',
  })
  @ApiConsumes('application/json')
  @ApiParam({ name: 'userId', type: String, required: true })
  @Version('1')
  @Get('/:userId')
  public async findUserById(@Param('userId') userId: string) {
    return await this.userService.findOneById(userId);
  }

  @HttpCode(HttpStatus.OK)
  @ApiConsumes('application/json')
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
  @ApiQuery({ name: 'pagination_query', type: PageOptionsDto, required: true })
  @Version('1')
  @Get()
  public async findAllUsers(
    @Query('pagination_query') pagination_query: PageOptionsDto,
  ) {
    return await this.userService.findAll(pagination_query);
  }

  // @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @ApiConsumes('application/json')
  @ApiNotFoundResponse({ description: NO_ENTITY_FOUND })
  @ApiForbiddenResponse({ description: UNAUTHORIZED_REQUEST })
  @ApiUnprocessableEntityResponse({ description: BAD_REQUEST })
  @ApiInternalServerErrorResponse({ description: INTERNAL_SERVER_ERROR })
  @ApiOkResponse({ description: 'OTP returned successfully' })
  @ApiOperation({
    summary: 'Get otp code for a user',
    description: 'Return an otp for that user',
  })
  @ApiOkResponse({
    description: 'Returns an otp code',
  })
  @ApiParam({ name: 'userId', type: String, required: true })
  @Version('1')
  @Get('/:userId/generate-otp')
  public async generateUserOtp(@Param('userId') userId: string) {
    return await this.userService.generateOtpById(userId);
  }

  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @ApiConsumes('application/json')
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
  @ApiBody({ type: VerifyUserOtpDto, required: true })
  @ApiParam({ name: 'userId', type: String, required: true })
  @Version('1')
  @Get('/:userId/verify-otp')
  public async verifyUserOtp(
    @Param('userId') userId: string,
    @Body() body: VerifyUserOtpDto,
  ) {
    return await this.userService.verifyOtpById(userId, body);
  }

  @HttpCode(HttpStatus.OK)
  @ApiConsumes('application/json')
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
  @ApiBody({ type: ForgetPasswordDto, required: true })
  @Version('1')
  @Post('/forgot-password')
  public async forgetPassword(@Body() body: ForgetPasswordDto) {
    return await this.userService.forgetPassword(body);
  }

  @HttpCode(HttpStatus.OK)
  @ApiConsumes('application/json')
  @ApiNotFoundResponse({ description: NO_ENTITY_FOUND })
  @ApiForbiddenResponse({ description: UNAUTHORIZED_REQUEST })
  @ApiUnprocessableEntityResponse({ description: BAD_REQUEST })
  @ApiInternalServerErrorResponse({ description: INTERNAL_SERVER_ERROR })
  @ApiOkResponse({ description: 'User returned successfully' })
  @ApiOperation({
    summary: 'Reset password for user',
    description: 'Return a message for user',
  })
  @ApiOkResponse({
    description: 'Returns a verification message',
  })
  @ApiBody({ type: ResetPasswordDto, required: true })
  @Version('1')
  @Post('/reset-password')
  public async resetPassword(
    @CurrentUser() user: UserPayloadDto,
    @Body() body: ResetPasswordDto,
  ) {
    return await this.userService.resetPassword(user.id, body);
  }

  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiConsumes('application/json')
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
  @ApiParam({ name: 'userId', type: String, required: true })
  @Version('1')
  @Delete('/:userId')
  public async deleteUser(@Param('userId') userId: string) {
    return await this.userService.deleteOneById(userId);
  }
}
