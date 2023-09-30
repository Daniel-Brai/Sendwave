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
import { Request, Response } from 'express';
import { AuthenticationService } from '../services/authentication.service';
import { AuthenticatedGuard } from '../guards/authenticated.guard';
import { RequestUser } from '@common/interfaces';
import { UserSignupDto } from '../../user/dtos/user-request.dto';

@ApiTags('Authentication')
@Controller('api/v1/authentication')
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
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login user',
    description: 'Return authenticated user to dashboard',
  })
  @ApiConsumes('application/json')
  @Post('/login')
  public login(@Res() response: Response, @Req() request: Request) {
    return this.authService.login(response, request);
  }

  @UseGuards(AuthenticatedGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Logout user',
    description: 'Destroys a user session',
  })
  @ApiConsumes('application/json')
  @Get('/logout')
  public logout(@Req() request: Request, @Res() response: Response) {
    return this.authService.logout(request, response);
  }
}
