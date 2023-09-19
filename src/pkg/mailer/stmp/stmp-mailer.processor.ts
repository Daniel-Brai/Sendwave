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
  REGISTRATION_CONFIRMED,
  INVITE_USER,
  MAIL_QUEUE,
  FORGET_PASSWORD,
} from '../mailer.constants';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@pkg/config';

@Injectable()
@Processor(MAIL_QUEUE)
export class MailProcessor {
  private readonly logger = new Logger(MailProcessor.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

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

  @Process(REGISTRATION_CONFIRMED)
  public async registrationConfirmed(
    job: Job<{
      emailAddress: string;
      confirmUrl: string;
    }>,
  ) {
    this.logger.log(
      `Sending registration confirmed email to '${job.data.emailAddress}'`,
    );

    try {
      return this.mailerService.sendMail({
        to: job.data.emailAddress,
        from: this.configService.get().services.mailer.smtp.address,
        subject: 'Welcome to Sendwave',
        template: './registration_confirmed',
        context: {
          confirmUrl: job.data.confirmUrl,
          email: job.data.emailAddress,
        },
      });
    } catch {
      this.logger.error(
        `Failed to send confirmation email to '${job.data.emailAddress}'`,
      );
    }
  }

  @Process(INVITE_USER)
  public async inviteUser(
    job: Job<{
      sent_by: string;
      fullname?: string;
      emailAddress: string;
      redirectUrl: string;
    }>,
  ) {
    this.logger.log(
      `Sending invitation registration email to '${job.data.emailAddress}'`,
    );

    try {
      return this.mailerService.sendMail({
        to: job.data.emailAddress,
        from: this.configService.get().services.mailer.smtp.address,
        subject: `Invitation to join Sendwave`,
        template: './invite_user',
        context: {
          from: job.data.sent_by,
          fullname: job.data.fullname,
          redirectUrl: job.data.redirectUrl,
        },
      });
    } catch {
      this.logger.error(
        `Failed to send invitation email to '${job.data.emailAddress}'`,
      );
    }
  }

  @Process(FORGET_PASSWORD)
  public async forgetPassword(
    job: Job<{
      name: string;
      otp_code: string;
      emailAddress: string;
      redirectUrl: string;
    }>,
  ) {
    this.logger.log(
      `Sending forgot password email to '${job.data.emailAddress}'`,
    );

    try {
      return this.mailerService.sendMail({
        to: job.data.emailAddress,
        from: this.configService.get().services.mailer.smtp.address,
        subject: `Invitation to join Sendwave`,
        template: './forgot_password',
        context: {
          name: job.data.name,
          otp_code: job.data.otp_code,
          redirectUrl: job.data.redirectUrl,
        },
      });
    } catch {
      this.logger.error(
        `Failed to send forgot password email to '${job.data.emailAddress}'`,
      );
    }
  }
}
