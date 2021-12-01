import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { z } from 'zod';
import { EntityManager } from '@mikro-orm/core';
import { UserRepository } from './user.repository';

@Injectable()
export class UserRegistrationGuard implements CanActivate {
  constructor(
    private readonly em: EntityManager,
    private readonly repo: UserRepository,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const email = await z.string().email().safeParseAsync(request.body.email);
    if (!email.success) {
        throw new BadRequestException();
    }
    await this.em.begin();
    const emailInUse = await this.repo.emailInUse(email.data);
    await this.em.commit();
    if (emailInUse) {
        throw new ForbiddenException();
    }
    return true;
  }
};
