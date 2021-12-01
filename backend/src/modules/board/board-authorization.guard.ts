import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { z } from 'zod';
import { EntityManager } from '@mikro-orm/core';
import { BoardRepository } from './board.repository';

@Injectable()
export class BoardAuthorizationGuard implements CanActivate {
  constructor(
    private readonly em: EntityManager,
    private readonly repo: BoardRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const toInteger = z.preprocess(
      (value) => parseInt(value as string),
      z.number(),
    );
    const boardId = await toInteger.safeParseAsync(request.params.boardId);
    if (!boardId.success) {
      throw new BadRequestException();
    }

    await this.em.begin();
    const board = await this.repo.getBoardById(boardId.data);
    if (!board) {
      await this.em.rollback();
      throw new NotFoundException();
    }
    const authorized = await this.repo.userOwnsBoard(request.user, board);
    await this.em.commit();
    if (!authorized) {
      return false;
    }
    request.board = board;
    return true;
  }
}
