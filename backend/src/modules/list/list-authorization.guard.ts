import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { z } from 'zod';
import { Request } from 'express';
import { Board } from 'src/modules/board/board.entity';
import { List } from 'src/modules/list/list.entity';
import { ListRepository } from 'src/modules/list/list.repository';
import { EntityManager } from '@mikro-orm/core';

@Injectable()
export class ListAuthorizationGuard implements CanActivate {
  constructor(
    private readonly listRepo: ListRepository,
    private readonly em: EntityManager,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: { board: Board; list?: List } & Request = context
      .switchToHttp()
      .getRequest();
    const toInteger = z.preprocess(
      (value) => parseInt(value as string),
      z.number(),
    );
    const listId = await toInteger.safeParseAsync(request.params.listId);
    if (!listId.success) {
      throw new BadRequestException();
    }

    await this.em.begin();
    const list = await this.listRepo.getListByIdWithPosition(listId.data);
    if (!list) {
      await this.em.rollback();
      throw new NotFoundException();
    }

    const authorized = await this.listRepo.listBelongsToBoard(
      list,
      request.board,
    );
    await this.em.commit();

    if (!authorized) {
      return false;
    }
    request.list = list;
    return authorized;
  }
}
