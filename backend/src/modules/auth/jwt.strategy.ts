import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ForbiddenException, HttpException, Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';
import { UserService } from 'src/modules/user/user.service';
import { User } from 'src/modules/user/user.entity';

export type AccessToken = {
  sub: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: AccessToken): Promise<User> {
    try {
      const user = await this.userService.getOne(payload.sub);
      return user;
    } catch (e) {
      if (e instanceof HttpException) {
        throw new ForbiddenException();
      }
      throw e;
    }
  }
}
