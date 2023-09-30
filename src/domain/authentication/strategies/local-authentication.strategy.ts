import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthenticationService } from '../services/authentication.service';
import { UserEntity } from '../../user/entities/user.entity';

@Injectable()
export class LocalAuthStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(LocalAuthStrategy.name);

  constructor(private readonly authService: AuthenticationService) {
    super({
      usernameField: 'email',
    });
  }

  public async validate(email: string, password: string): Promise<UserEntity> {
    this.logger.log(`Validate user login details`);
    try {
      return await this.authService.validateUserByPassword({ email, password });
    } catch (error) {
      this.logger.error(
        { id: `validate-user-login-details-error` },
        `Validate user login details`,
      );
      throw new UnauthorizedException('Invalid email or password!');
    }
  }
}
