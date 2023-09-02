import { Injectable as Inject, Logger as L } from '@nestjs/common';
import { Job as J } from 'bull';
import {
  OnQueueActive as OQA,
  OnQueueCompleted as OQC,
  OnQueueFailed as OQF,
  Process as Ps,
  Processor as Pr,
} from '@nestjs/bull';
import {
  CONFIRM_REGISTRATION as CR,
  MAIL_QUEUE as MQ,
} from '../constants/mail.constants';
import { MailerService as MS } from '@nestjs-modules/mailer';
import { ConfigService as CS } from '@nestjs/config';

@Inject()
@Pr(MQ)
export class EmailProcessor {
  private readonly _logger = new L(EmailProcessor.name);

  constructor(
    private readonly _mailerService: MS,
    private readonly _configService: CS,
  ) {}

  @OQA()
  public onActive(job: J) {
    this._logger.debug(`Processing job ${job.id} of type ${job.name}`);
  }

  @OQC()
  public onComplete(job: J) {
    this._logger.debug(`Completed job ${job.id} of type ${job.name}`);
  }

  @OQF()
  public onError(job: J<any>, error: any) {
    this._logger.error(
      `Failed job ${job.id} of type ${job.name}: ${error.message}`,
      error.stack,
    );
  }

  @Ps(CR)
  public async confirmRegistration(
    job: J<{
      fullname: string;
      emailAddress: string;
      confirmUrl: string;
      code: string;
    }>,
  ) {
    this._logger.log(
      `Sending confirm registration email to '${job.data.emailAddress}' with OTP code: ${job.data.code}`,
    );

    try {
      return this._mailerService.sendMail({
        to: job.data.emailAddress,
        from: this._configService.get('EMAIL_ADDRESS'),
        subject: 'Welcome to Repotran',
        template: './confirm',
        context: {
          confirmUrl: job.data.confirmUrl,
          code: job.data.code,
          name: job.data.fullname,
        },
      });
    } catch {
      this._logger.error(
        `Failed to send confirmation email to '${job.data.emailAddress}'`,
      );
    }
  }
}
