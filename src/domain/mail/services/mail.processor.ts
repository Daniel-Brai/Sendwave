import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bull';
import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { BATCH_MAIL_QUEUE, SEND_BATCH_MAIL } from '../mail.constants';
import { MailService } from './mail.service';

@Injectable()
@Processor(BATCH_MAIL_QUEUE)
export class MailProcessor {
  private readonly logger = new Logger(MailProcessor.name);

  constructor(private readonly mailerService: MailService) {}

  @OnQueueActive()
  public onActive(job: Job) {
    this.logger.debug(`Processing job ${job.id} of type ${job.name}`);
  }

  @OnQueueCompleted()
  public onComplete(job: Job) {
    this.logger.debug(`Completed job ${job.id} of type ${job.name}`);
  }

  @OnQueueFailed()
  public onError(job: Job<any>, error: any) {
    this.logger.error(
      `Failed job ${job.id} of type ${job.name}: ${error.message}`,
      error.stack,
    );
  }

  @Process(SEND_BATCH_MAIL)
  public async sendMail(
    job: Job<{
      emailAddress: string;
    }>,
  ) {
    this.logger.log(`Sending emails to: '${job.data.emailAddress}'`);

    try {
      return '';
    } catch {
      this.logger.error(`Failed to send emails to '${job.data.emailAddress}'`);
    }
  }
}
