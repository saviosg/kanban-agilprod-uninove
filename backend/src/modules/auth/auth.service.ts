import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'src/modules/user/user.entity';
import { UserService } from 'src/modules/user/user.service';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { HashingService } from 'src/modules/hashing/hashing.service';
import { UserRepository } from 'src/modules/user/user.repository';
import { EntityManager } from '@mikro-orm/core';

export type TokenDto = {
  token: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly userRepo: UserRepository,
    private readonly em: EntityManager,
    private readonly jwtService: JwtService,
    private readonly hashingService: HashingService,
  ) {}

  async authenticate(email: string, password: string): Promise<User> {
    await this.em.begin();
    const user = await this.userRepo.getUserByEmail(email);
    await this.em.commit();
    if (!user) {
      throw new NotFoundException();
    }
    const passwordsAreEqual = await this.hashingService.compare(
      password,
      user.password,
    );

    if (!passwordsAreEqual) {
      throw new ForbiddenException();
    }

    return user;
  }

  async getToken(user: User, options?: JwtSignOptions): Promise<TokenDto> {
    const payload = { sub: user.id };
    return {
      token: await this.jwtService.signAsync(payload, options),
    };
  }
}
