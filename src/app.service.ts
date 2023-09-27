import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Response, Request } from 'express';

@Injectable()
export class AppService {
  public root(res: Response) {
    return res.render('index', {
      title: 'Sendwave - Streamlining the bulk email experience',
    });
  }

  public dashboard(res: Response, req: Request) {
    try {
      return res.render('dashboard', {
        title: 'Dashboard | Sendwave',
        action: req.query.action,
        url: req.url,
        reports: null,
      });
    } catch (error) {
      throw new InternalServerErrorException('Oops! Something went wrong');
    }
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

  public verifyAccount(token: string, res: Response) {
    return res.render('account/verify-account', {
      title: 'Verify account | Sendwave',
      token: token,
    });
  }

  public changePassword(token: string, res: Response) {
    return res.render('account/change-password', {
      title: 'Change your password | Sendwave',
      token: token,
    });
  }
}
