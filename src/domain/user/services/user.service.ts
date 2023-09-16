import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppConfigService } from '@pkg/config';
import { PostgresErrorCode } from '@pkg/database';
import { TermiiService } from '@pkg/termii';
import { PageDto, PageMetaDto, PageOptionsDto } from '@common/dtos';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import {
  ForgetPasswordDto,
  ResetPasswordDto,
  UserSignupDto,
  UpdateUserDto,
  VerifyUserOtpDto,
} from '../dtos/user-request.dto';
import {
  GenerateUserOtpDto,
  VerifyMessageDto,
} from '../dtos/user-response.dto';
import { UserEntity } from '../entities/user.entity';
import { AuthenticationService } from '../../authentication/services/authentication.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly configService: AppConfigService,
    private readonly authService: AuthenticationService,
    private readonly termiiService: TermiiService,
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
          email: email,
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

  public async findOneByPhoneNumber(phoneNumber: string): Promise<UserEntity> {
    this.logger.log(`Retrieve user by phone number`);
    try {
      const user = await this.userRepository.findOne({
        where: {
          phone_number: phoneNumber,
        },
      });
      return user;
    } catch (error) {
      this.logger.error(
        { id: `retrieve-user-by-phone-number-error` },
        `Retrieve user by phone number`,
      );
      throw new NotFoundException(
        'No account associated with this phone number',
      );
    }
  }

  public async create(body: UserSignupDto): Promise<UserEntity> {
    this.logger.log(`Create a user`);
    try {
      const hashedPassword = await this.hash(body.password);
      const createdUser = this.userRepository.create({
        ...body,
        password: hashedPassword,
      });
      const user = await this.userRepository.save(createdUser);
      return user;
    } catch (error) {
      this.logger.error({ id: `create-a-user-error` }, `Create a user`);
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new ConflictException('User with that email already exists');
      }
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  public async generateOtpById(id: string): Promise<GenerateUserOtpDto> {
    this.logger.log(`Generate a user otp by id`);
    try {
      const user = await this.findOneById(id);
      const res = await this.termiiService.sendToken({
        user: user.phone_number,
        company: 'N-Alert',
        pinLength: 6,
        pinAttempts: 1,
        ttl: 60,
        message: `Hi ${user.name}!` + ' Your verification code is <otp> AMAPAY',
      });
      return {
        userId: user.id,
        message: `Otp code generated successfully with the pinId: ${res.pinId}`,
      };
    } catch (error) {
      this.logger.error(
        { id: `generate-a-user-otp-by-id` },
        `Generate a user otp by id`,
      );
      throw new InternalServerErrorException('User OTP generation failed');
    }
  }

  public async verifyOtpById(
    id: string,
    { pinId, otp_code }: VerifyUserOtpDto,
  ): Promise<VerifyMessageDto> {
    this.logger.log(`Verify a user otp by id`);
    try {
      const user = await this.findOneById(id);
      await this.termiiService.verifyToken({ pinId, otp_code });
      const updatedUser = await this.userRepository.preload({
        id: user.id,
        isVerified: true,
        ...user,
      });
      await this.userRepository.save(updatedUser);
      return {
        message: 'Account verification successful',
      };
    } catch (error) {
      this.logger.error(
        { id: `verify-a-user-otp-by-id` },
        `Verify a user otp by id`,
      );
      throw new InternalServerErrorException(
        'Something went wrong - User verification OTP generation failed',
      );
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
      const savedUser = await this.userRepository.save(updatedUser);
      return savedUser;
    } catch (error) {
      this.logger.error(
        { id: `update-a-user-by-id-error` },
        `Update a user by id`,
      );
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  public async updateRefreshTokenById(id: string, refToken: string) {
    this.logger.log(`Update a user refresh token by id`);

    let user: UserEntity;
    try {
      if (!refToken) {
        user = await this.findOneById(id);
        const updatedUser = { ...user, refresh_token: null };
        return await this.userRepository.save(updatedUser);
      } else {
        const hashedToken = await this.hash(refToken);
        user = await this.findOneById(id);
        const updatedUser = { ...user, refresh_token: hashedToken };
        return await this.userRepository.save(updatedUser);
      }
    } catch (error) {
      this.logger.error(
        { id: `update-a-user-refresh-token-by-id-error` },
        `Update a user refresh token by id`,
      );
      throw new NotFoundException('User does not exist');
    }
  }

  public async resetPassword(id: string, body: ResetPasswordDto) {
    this.logger.log(`Update a logged in user password by id`);
    try {
      const foundUser = await this.findOneById(id);
      const isMatch = await this.authService.comparePassword(
        body.password_update.old_password,
        foundUser.password,
      );
      if (isMatch) {
        const user = await this.updateOneById(foundUser.id, {
          password: body.password_update.new_password,
          ...foundUser,
        });
        return user;
      }
    } catch (error) {
      this.logger.error(
        { id: `update-a-logged-in-user-password-by-id-error` },
        `Update a logged in user password by id`,
      );
      throw new NotFoundException('No account associated with this email');
    }
  }

  public async forgetPassword(
    body: ForgetPasswordDto,
  ): Promise<GenerateUserOtpDto> {
    this.logger.log(`Update a user with forgetten password by email`);

    try {
      const user = await this.findOneByEmail(body.email);
      return await this.generateOtpById(user.id);
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
