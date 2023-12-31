import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Injectable,
  Inject,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostgresErrorCode } from '@pkg/database';
import { PageDto, PageMetaDto, PageOptionsDto } from '@common/dtos';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import {
  ForgetPasswordDto,
  ResetPasswordDto,
  UserSignupDto,
  UpdateUserDto,
  VerifyUserOtpDto,
  ChangePasswordDto,
} from '../dtos/user-request.dto';
import {
  GenerateUserOtpDto,
  VerifyMessageDto,
} from '../dtos/user-response.dto';
import { UserEntity } from '../entities/user.entity';
import { AuthenticationService } from '../../authentication/services/authentication.service';
import { MailService } from '@pkg/mailer';
import {
  generateOtpCode,
  generateAlphanumericToken,
  generateRandomKey,
} from '@utils/generators';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @Inject(forwardRef(() => AuthenticationService))
    private readonly authService: AuthenticationService,
    private readonly mailService: MailService,
  ) {}

  public async findAll(query: PageOptionsDto): Promise<PageDto<UserEntity>> {
    this.logger.log(`Retrieve users in a paginated view`);

    try {
      const queryBuilder = this.userRepository.createQueryBuilder('user');

      queryBuilder
        .orderBy('user.created_at', query.order)
        .skip(query.skip)
        .take(query.take);

      const itemCount = await queryBuilder.getCount();
      const { entities } = await queryBuilder.getRawAndEntities();

      const pageMetaDto = new PageMetaDto({ pageOptionsDto: query, itemCount });

      return new PageDto(entities, pageMetaDto);
    } catch (error) {
      this.logger.error(
        { id: `retrieve-users-in-paginated-view-error` },
        `Retrieve users in a paginated view`,
      );
      throw new InternalServerErrorException('Something went error');
    }
  }

  public async findOneById(id: string): Promise<UserEntity> {
    this.logger.log(`Retrieve user by id`);
    try {
      const user = await this.userRepository.findOne({
        where: {
          id,
        },
      });
      return user;
    } catch (error) {
      this.logger.error(
        { id: `retrieve-user-by-id-error` },
        `Retrieve user by id`,
      );
      throw new NotFoundException('User does not exist');
    }
  }

  public async findOneByEmail(email: string): Promise<UserEntity> {
    this.logger.log(`Retrieve user by email`);
    try {
      const user = await this.userRepository.findOne({
        where: {
          email: email.toLowerCase(),
        },
      });
      return user;
    } catch (error) {
      this.logger.error(
        { id: `retrieve-user-by-email-error` },
        `Retrieve user by email`,
      );
      throw new NotFoundException('No account associated with this email');
    }
  }

  public async create(body: UserSignupDto): Promise<UserEntity> {
    this.logger.log(`Create a user`);
    try {
      const hashedPassword = await this.hash(body.password);
      const otp_code = generateOtpCode(6);
      const token = generateAlphanumericToken(32);
      const createdUser = this.userRepository.create({
        email: body.email.toLowerCase(),
        password: hashedPassword,
        confirmation_token: token,
        otp_code: otp_code,
      });
      const user = await this.userRepository.save(createdUser);
      await this.mailService.sendRegistrationConfirmEmail(
        user.email,
        user.otp_code,
        user.confirmation_token,
      );
      return user;
    } catch (error) {
      this.logger.error({ id: `create-a-user-error` }, `Create a user`);
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new ConflictException('User with that email already exists');
      }
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  public async updateOneById(
    id: string,
    body: UpdateUserDto,
  ): Promise<UserEntity> {
    this.logger.log(`Update a user by id`);
    try {
      const foundUser = await this.findOneById(id);
      const updatedUser = await this.userRepository.preload({
        id: foundUser.id,
        ...body,
      });
      return await this.userRepository.save(updatedUser);
    } catch (error) {
      this.logger.error(
        { id: `update-a-user-by-id-error` },
        `Update a user by id`,
      );
      throw new InternalServerErrorException(
        'Something went wrong - unable to update user by id',
      );
    }
  }

  public async generateOtpEmailById(id: string): Promise<GenerateUserOtpDto> {
    this.logger.log(`Generate a user otp by id`);
    try {
      const user = await this.findOneById(id);
      await this.mailService.sendRegistrationConfirmEmail(
        user.email,
        user.otp_code,
        user.confirmation_token,
      );
      return {
        userId: user.id,
        message: `Otp code generated and sent via email`,
      };
    } catch (error) {
      this.logger.error(
        { id: `generate-a-user-otp-by-id` },
        `Generate a user otp by id`,
      );
      throw new InternalServerErrorException('User OTP generation failed');
    }
  }

  public async verifyOtpByToken(
    token: string,
    body: VerifyUserOtpDto,
  ): Promise<VerifyMessageDto> {
    this.logger.log(`Verify a user otp by id`);

    const user = await this.userRepository.findOne({
      where: {
        confirmation_token: token,
      },
    });

    if (user.otp_code === null || body.otp_code !== user.otp_code) {
      throw new BadRequestException('Invalid OTP code');
    }

    try {
      const updatedUser = await this.updateOneById(user.id, {
        is_verified: true,
        otp_code: null,
        confirmation_token: null,
        ...user,
      });
      await this.mailService.sendRegistrationConfirmedEmail(updatedUser.email);
      return {
        message: 'Account verification successful',
      };
    } catch (error) {
      this.logger.error(
        { id: `verify-a-user-otp-by-id` },
        `Verify a user otp by id`,
      );
      throw new BadRequestException('Verification of OTP code failed!');
    }
  }

  public async resetPassword(
    id: string,
    body: ResetPasswordDto,
  ): Promise<VerifyMessageDto> {
    this.logger.log(`Update a logged in user password by id`);
    try {
      const foundUser = await this.findOneById(id);
      const isMatch = await this.authService.comparePassword(
        body.password_update.old_password,
        foundUser.password,
      );
      if (isMatch) {
        await this.updateOneById(foundUser.id, {
          password: body.password_update.new_password,
          ...foundUser,
        });
        return {
          message: 'Account reset successfully',
        };
      }
    } catch (error) {
      this.logger.error(
        { id: `update-a-logged-in-user-password-by-id-error` },
        `Update a logged in user password by id`,
      );
      throw new BadRequestException(
        'No account or wrong password associated with this email',
      );
    }
  }

  public async changePassword(
    token: string,
    body: ChangePasswordDto,
  ): Promise<VerifyMessageDto> {
    this.logger.log(`Change password by token`);

    try {
      const user = await this.userRepository.findOne({
        where: {
          confirmation_token: token,
        },
      });
      const hashedPassword = await this.hash(body.new_password);
      await this.updateOneById(user.id, {
        password: hashedPassword,
        confirmation_token: null,
        ...user,
      });
      return {
        message: 'Account updated successfully',
      };
    } catch (error) {
      this.logger.error(
        { id: `change-user-password-error` },
        `Change password by token`,
      );
      throw new BadRequestException('Account update failed!');
    }
  }

  public async forgetPassword(
    body: ForgetPasswordDto,
  ): Promise<VerifyMessageDto> {
    this.logger.log(`Update a user with forgetten password by email`);

    const user = await this.findOneByEmail(body.email);
    if (user.is_verified === false) {
      throw new BadRequestException('You are not verified');
    }

    try {
      const token = generateAlphanumericToken(32);
      const otp_code = generateOtpCode(6);
      const updatedUser = await this.updateOneById(user.id, {
        confirmation_token: token,
        otp_code: otp_code,
        ...user,
      });
      await this.mailService.sendForgotPasswordEmail(
        updatedUser.email,
        updatedUser.confirmation_token,
      );
      return {
        message: 'Email sent successfully',
      };
    } catch (error) {
      this.logger.error(
        { id: `update-a-user-with-forgotten-password-by-email-error` },
        `Update a user with forgotten password by email`,
      );
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  public async deleteOneById(id: string) {
    this.logger.log(`Delete a user by id`);
    try {
      const user = await this.findOneById(id);
      return await this.userRepository.delete({ id: user.id });
    } catch (error) {
      this.logger.error(
        { id: `delete-a-user-by-id-error` },
        `Delete a user by id`,
      );
      throw new NotFoundException('User does not exist');
    }
  }

  private async hash(token: string) {
    return await bcrypt.hash(token, 10);
  }
}
