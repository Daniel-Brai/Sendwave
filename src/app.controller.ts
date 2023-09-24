import { Controller, Get, Res, Req, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { Response, Request } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  public getRoot(@Res() res: Response) {
    return this.appService.root(res);
  }

  @Get('/dashboard')
  public getDashboard(@Res() res: Response, @Req() req: Request) {
    return this.appService.dashboard(res, req);
  }

  @Get('/login')
  public getLogin(@Res() res: Response) {
    return this.appService.login(res);
  }

  @Get('/signup')
  public getSignup(@Res() res: Response) {
    return this.appService.signup(res);
  }

  @Get('/forgot-password')
  public getForgotPassword(@Res() res: Response) {
    return this.appService.forgotPassword(res);
  }

  @Get('/reset-password')
  public getResetPassword(@Res() res: Response) {
    return this.appService.resetPassword(res);
  }

  @Get('/verify-account')
  public getVerifyAccount(@Query('token') token: string, @Res() res: Response) {
    return this.appService.verifyAccount(token, res);
  }
}
