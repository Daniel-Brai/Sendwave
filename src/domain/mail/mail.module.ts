import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailService } from './services/mail.service';
import { MailContactEntity } from './entities/mail-contact.entity';
import { MailController } from './controllers/mail.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MailContactEntity]),
    forwardRef(() => UserModule),
  ],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
