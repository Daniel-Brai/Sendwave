import { Controller, Get, Res, Req, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { RequestUser } from '@common/interfaces';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  public getRoot(@Res() res: Response) {
    return this.appService.root(res);
  }

  @Get('/dashboard')
  public getDashboard(@Res() res: Response, @Req() req: RequestUser) {
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

  @Get('/change-password')
  public getChangePassword(
    @Query('token') token: string,
    @Res() res: Response,
  ) {
    return this.appService.changePassword(token, res);
  }
}
