import { EntityManager } from '@mikro-orm/knex';
import { Reference, wrap } from '@mikro-orm/core';
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'src/modules/user/user.entity';
import { Board } from './board.entity';
import { UpdateBoardDto } from './update-board.dto';
import { ReplaceBoardDto } from './replace-board.dto';
import { BoardRepository } from './board.repository';
import { CreateBoardDto } from './create-board.dto';

@Injectable()
export class BoardService {
  constructor(
    private readonly em: EntityManager,
    private readonly repo: BoardRepository,
  ) {}

  public async delete(board: Board): Promise<undefined> {
    try {
      await this.em.begin();
      this.em.remove(board);
      await this.em.commit();
      return;
    } catch (e) {
      await this.em.rollback();
      throw e;
    }
  }

  public async getOne(boardId: number): Promise<Board> {
    try {
      await this.em.begin();
      const result = await this.repo.getBoardById(boardId);
      if (!result) {
        throw new NotFoundException();
      }
      await this.em.commit();
      return result;
    } catch (e) {
      await this.em.rollback();
      throw e;
    }
  }

  public async getMany(owner: User): Promise<Board[]> {
    try {
      await this.em.begin();
      const result = await this.repo.getBoardsByOwner(owner);
      if (!result || result.length === 0) {
        throw new NotFoundException();
      }
      await this.em.commit();
      return result;
    } catch (e) {
      await this.em.rollback();
      throw e;
    }
  }

  public async create(dto: CreateBoardDto, owner: User): Promise<Board> {
    try {
      await this.em.begin();
      const board = new Board();
      wrap(board).assign(dto);
      board.owner = Reference.create(owner);
      this.em.persist(board);
      await this.em.commit();
      return board;
    } catch (e) {
      await this.em.rollback();
      throw e;
    }
  }

  public async update(board: Board, dto: UpdateBoardDto): Promise<Board> {
    try {
      wrap(board).assign(dto);
      await this.em.begin();
      this.em.persist(board);
      await this.em.commit();
      return board;
    } catch (e) {
      await this.em.rollback();
      throw e;
    }
  }

  public async replace(board: Board, dto: ReplaceBoardDto): Promise<Board> {
    try {
      wrap(board).assign(dto);
      await this.em.begin();
      this.em.persist(board);
      await this.em.commit();
      return board;
    } catch (e) {
      await this.em.rollback();
      throw e;
    }
  }
}
