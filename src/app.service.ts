import { Injectable } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class AppService {
   root(res: Response) {
    return res.render('index', {
      title: 'Sendwave - Streamlining the bulk email experience',
    });
  }
}
