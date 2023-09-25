import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { UserSignInDto } from '../dtos/auth-request.dto';
import { UserService } from '../../user/services/user.service';
import { RequestUser } from '@common/interfaces';
import { UserSignupDto } from 'src/domain/user/dtos/user-request.dto';

@Injectable()
export class AuthenticationService {
  private readonly logger = new Logger(AuthenticationService.name);

  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  public async login(
    response: Response,
    request: RequestUser,
  ): Promise<Express.User> {
    this.logger.log(`Login user`);
    try {
      return request.user;
    } catch (error) {
      this.logger.error({ id: `Login-user-error` }, `Login user`);
      throw new InternalServerErrorException(
        'Something went wrong - unable to login user',
      );
    }
  }

  public async logout(request: RequestUser, response: Response): Promise<void> {
    this.logger.log(`Log out authenticated user`);
    try {
      request.session.destroy((err: Error) => {
        if (err) {
          throw new InternalServerErrorException('Something went wrong!');
        }
      });
      response.redirect('/');
    } catch (error) {
      this.logger.error(
        { id: `log-out-authenticated-user-error` },
        `Log out authenticated user`,
      );
      throw new InternalServerErrorException('Something went wrong!');
    }
  }

  public async signup(body: UserSignupDto) {
    this.logger.log(`Register user`);
    try {
      return await this.userService.create(body);
    } catch (error) {
      this.logger.error({ id: `register-user-error` }, `Register user`);
      throw new BadRequestException('Something went wrong!');
    }
  }

  public async validateUserByPassword(payload: UserSignInDto) {
    this.logger.log(`Validate user login`);

    const { email, password } = payload;
    const user = await this.userService.findOneByEmail(email);

    const isMatch = await this.comparePassword(password, user.password);

    if (isMatch) {
      return user;
    } else {
      this.logger.error(
        { id: `validate-user-login-error` },
        `Validate user login`,
      );
      throw new BadRequestException('Invalid email or password');
    }
  }

  public async comparePassword(
    enteredPassword: string,
    dbPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, dbPassword);
  }
}
