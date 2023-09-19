import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UserEntity } from '../../user/entities/user.entity';
import { UserService } from '../../user/services/user.service';

@Injectable()
export class AuthenticationSerializer extends PassportSerializer {
  constructor(private readonly userService: UserService) {
    super();
  }

  public async serializeUser(
    user: UserEntity,
    done: (err: Error, user: { id: string; email: string }) => void,
  ) {
    done(null, { id: user.id, email: user.email });
  }

  public async deserializeUser(
    payload: { id: string; email: string },
    done: (err: Error, user: UserEntity) => void,
  ) {
    const user = await this.userService.findOneById(payload.id);
    done(null, user);
  }
}
