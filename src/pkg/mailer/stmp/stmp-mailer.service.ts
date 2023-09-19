import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { REGISTRATION_CONFIRMED, MAIL_QUEUE } from '../mailer.constants';
import { Queue } from 'bull';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(@InjectQueue(MAIL_QUEUE) private readonly mailQueue: Queue) {}

  public async sendConfirmationEmail(
    emailAddress: string,
    confirmUrl: string,
  ): Promise<void> {
    try {
      await this.mailQueue.add(REGISTRATION_CONFIRMED, {
        emailAddress,
        confirmUrl,
      });
    } catch (error) {
      this.logger.error(
        `Error queueing registration email to user ${emailAddress}`,
      );

      throw error;
    }
  }
}
