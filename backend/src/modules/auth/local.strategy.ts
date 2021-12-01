import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/modules/user/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly authService: AuthService;

  constructor(authService: AuthService) {
    super({ usernameField: 'email' });
    this.authService = authService;
  }

  async validate(email: string, password: string): Promise<User> {
    return await this.authService.authenticate(email, password);
  }
}
