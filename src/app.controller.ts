import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  public getRoot(@Res() res: Response) {
    return this.appService.root(res);
  }

  @Get('/dashboard')
  public getDashboard(@Res() res: Response) {
    return this.appService.dashboard(res);
  }

  @Get('/login')
  public getLogin(@Res() res: Response) {
    return this.appService.login(res);
  }

  @Get('/signup')
  public getSignup(@Res() res: Response) {
    return this.appService.signup(res);
  }
}
