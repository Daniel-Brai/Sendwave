import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { User } from '@common/interfaces';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthSerializer extends PassportSerializer {
  constructor(private readonly authService: AuthService) {
    super();
  }
  serializeUser(
    user: User,
    done: (err: Error, user: { id: string; username: string }) => void,
  ) {
    done(null, { id: user.id, username: user.username });
  }

  deserializeUser(
    payload: { id: string; username: string },
    done: (err: Error, user: Omit<User, 'password'>) => void,
  ) {
    const user = this.authService.findById(payload.id);
    done(null, user);
  }
}
