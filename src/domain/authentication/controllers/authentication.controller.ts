import {
  Controller,
  Get,
  Post,
  HttpCode,
  HttpStatus,
  Req,
  Res,
  UseGuards,
  Body,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
  ApiOkResponse,
  ApiTags,
  ApiProperty,
} from '@nestjs/swagger';
import { LocalGuard } from '../guards/local-authentication.guard';
import { Response } from 'express';
import { AuthenticationService } from '../services/authentication.service';
import { AuthenticatedGuard } from '../guards/authenticated.guard';
import { RequestUser } from '@common/interfaces';
import { GithubAuthGuard } from '../guards/github-authentication.guard';
import { UserSignupDto } from 'src/domain/user/dtos/user-request.dto';

@ApiTags('Authentication')
@Controller('v1/api/authentication')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @HttpCode(HttpStatus.CREATED)
  @ApiProperty({
    title: 'Register user',
    description: 'Create a user by email and password',
    example: { email: 'johndoe@gmail.com', password: 'AnyTypePassowrd%91998' },
    required: true,
  })
  @ApiCreatedResponse({
    description: 'User created successfully',
  })
  @ApiOkResponse({ description: 'User created successfully' })
  @ApiOperation({
    summary: 'Create a user',
    description: 'Returns a new user',
  })
  @ApiConsumes('application/json')
  @ApiBody({
    description: 'The parameters needed to create a user',
    type: UserSignupDto,
    required: true,
  })
  @Post('/signup')
  public async signup(@Body() body: UserSignupDto) {
    return await this.authService.signup(body);
  }

  @UseGuards(LocalGuard)
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  public async login(@Req() request: RequestUser) {
    return await this.authService.login(request);
  }

  @UseGuards(AuthenticatedGuard)
  @Get('/logout')
  @HttpCode(HttpStatus.OK)
  public async logout(@Req() request: RequestUser, @Res() response: Response) {
    return await this.authService.logout(request, response);
  }

  @UseGuards(GithubAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description: 'Login with github',
    summary: 'Login user with github',
  })
  @Get('/github/login')
  public async githubAuth(@Req() _req: Request) {}
}
