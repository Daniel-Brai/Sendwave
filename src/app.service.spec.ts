import { AppService } from './app.service';
import { Response } from 'express';

describe('Get the AppService', () => {
  let appService: AppService;
  let res: Response;

  describe('get root page', () => {
    it('should return successful', () => {
      expect(appService.root(res)).toReturnWith(res.statusCode === 200);
    });
  });
});
