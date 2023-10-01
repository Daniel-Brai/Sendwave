import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.isAuthenticated()) {
      if (
        req.originalUrl.includes('login') || 
        req.originalUrl.includes('signup') ||
        req.originalUrl.includes('verify-account') ||
        req.originalUrl.includes('forgot-password')
      ) {
        res.redirect('/dashboard');
      } else {
        next();
      }
    } else {
      if (req.originalUrl.includes('dashboard')) {
        res.redirect('/login');
      } else {
        next();
      }
    }
  }
}






