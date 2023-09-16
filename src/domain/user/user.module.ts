import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryModule } from '@pkg/cloudinary';
import { AppConfigModule } from '@pkg/config';
import { TermiiModule } from '@pkg/termii';
import { UserEntity } from './entities/user.entity';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { AuthenticationModule } from '../authentication/authentication.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    AppConfigModule,
    CloudinaryModule,
    TermiiModule,
    forwardRef(() => AuthenticationModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
