import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserSignInDto } from '../dtos/auth-request.dto';
import { UserService } from '../../user/services/user.service';
import { UserSignupDto } from '../../user/dtos/user-request.dto';
import { RequestUser } from '@common/interfaces';

@Injectable()
export class AuthenticationService {
  private readonly logger = new Logger(AuthenticationService.name);

  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  public login(request: RequestUser): Express.User {
    this.logger.log(`Login user`);
    return request.user;
  }

  public logout(request: RequestUser): { message: string } {
    this.logger.log(`Log out authenticated user`);
    request.session.destroy((err: Error) => {
      if (err) {
        this.logger.error(
          { id: `log-out-authenticated-user-error` },
          `Log out authenticated user`,
        );
        throw new InternalServerErrorException('Something went wrong!');
      }
    });
    return { message: 'User logout successful' };
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
