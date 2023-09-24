import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import {
  REGISTRATION_CONFIRM,
  REGISTRATION_CONFIRMED,
  MAIL_QUEUE,
} from '../mailer.constants';
import { Queue } from 'bull';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(@InjectQueue(MAIL_QUEUE) private readonly mailQueue: Queue) {}

  public async sendRegistrationConfirmEmail(
    emailAddress: string,
    otp_code: string,
    confirm_token: string,
  ): Promise<void> {
    try {
      // const deployedUrl = process.env.LIVE_APP_URL
      // if (deployedUrl !== null && deployedUrl !== undefined || deployedUrl === '') {
      //   confirm_token = deployedUrl + confirm_token;
      // }
      await this.mailQueue.add(REGISTRATION_CONFIRM, {
        emailAddress,
        otp_code,
        confirm_token,
      });
    } catch (error) {
      this.logger.error(
        `Error queueing confirm registration email to user ${emailAddress}`,
      );

      throw error;
    }
  }

  public async sendRegistrationConfirmedEmail(
    emailAddress: string,
  ): Promise<void> {
    try {
      await this.mailQueue.add(REGISTRATION_CONFIRMED, {
        emailAddress,
      });
    } catch (error) {
      this.logger.error(
        `Error queueing registration confirmed email to user ${emailAddress}`,
      );

      throw error;
    }
  }
}
