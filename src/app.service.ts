import { Injectable } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class AppService {
  public root(res: Response) {
    return res.render('index', {
      title: 'Sendwave - Streamlining the bulk email experience',
    });
  }

  public dashboard(res: Response) {
    return res.render('dashboard', {
      title: 'Dashboard | Sendwave',
    });
  }

  public login(res: Response) {
    return res.render('account/login', {
      title: 'Login | Sendwave',
    });
  }

  public signup(res: Response) {
    return res.render('account/signup', {
      title: 'Create an account | Sendwave',
    });
  }

  public forgotPassword(res: Response) {
    return res.render('account/forgot-password', {
      title: 'Forgot Password | Sendwave',
    });
  }
  
  public resetPassword(res: Response) {
    return res.render('account/reset-password', {
      title: 'Reset Password | Sendwave',
    });
  }
}
