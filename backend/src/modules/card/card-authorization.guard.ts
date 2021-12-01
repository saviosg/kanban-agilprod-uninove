import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CardRepository } from 'src/modules/card/card.repository';
import { z } from 'zod';
import { EntityManager } from '@mikro-orm/core';

@Injectable()
export class CardAuthorizationGuard implements CanActivate {
  constructor(
    private readonly em: EntityManager,
    private readonly repo: CardRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const toInteger = z.preprocess(
      (value) => parseInt(value as string),
      z.number(),
    );
    const cardId = await toInteger.safeParseAsync(request.params.cardId);
    if (!cardId.success) {
      throw new BadRequestException();
    }
    await this.em.begin();
    const card = await this.repo.getCardById(cardId.data);
    if (!card) {
      await this.em.rollback();
      throw new NotFoundException();
    }
    const authorized = await this.repo.cardBelongsToList(request.list, card);
    await this.em.commit();
    if (!authorized) {
      return false;
    }
    request.card = card;
    return true;
  }
}
