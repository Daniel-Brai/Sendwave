import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bull';
import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import {
  BATCH_MAIL_QUEUE,
  MailSchedule,
  SEND_BATCH_MAIL,
} from '../mail.constants';
import { SendMailDto } from '../dtos/mail-request.dto';
import { MailContext } from '../mail.constants';
import * as nodemailer from 'nodemailer';
import SMTPPool from 'nodemailer/lib/smtp-pool';

@Injectable()
@Processor(BATCH_MAIL_QUEUE)
export class MailProcessor {
  private readonly logger = new Logger(MailProcessor.name);

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
      body: SendMailDto;
      query: MailSchedule;
    }>,
  ) {
    this.logger.log(`Sending emails`);
    try {
      const provider = nodemailer.createTransport({
        service: job.data.body.service,
        auth: {
          user: job.data.body.email,
          pass: job.data.body.password,
        },
        tls: {
          ciphers: 'SSLv3',
          rejectUnauthorized: false,
        },
        pool: true,
      });
      const user = job.data.body.email;
      const query = job.data.query;
      const context = job.data.body.data;
      if (query) {
        return await this.sendScheduledEmail(provider, user, context);
      }
    } catch (error) {
      this.logger.error(`Failed to send emails`);
    }
  }

  public async sendScheduledEmail(
    provider: nodemailer.Transporter<SMTPPool.SentMessageInfo>,
    user: string,
    body: Array<MailContext>,
  ) {
    try {
      for (const ctx of body) {
        await provider.sendMail({
          from: user,
          to: ctx.receipient,
          subject: ctx.subject,
          text: ctx.message,
        });
      }
    } catch (error) {
      throw error;
    }
  }
}
