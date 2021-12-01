import { EntityManager } from '@mikro-orm/postgresql';
import { Reference, wrap } from '@mikro-orm/core';
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { List } from './list.entity';
import { Board } from 'src/modules/board/board.entity';
import { UpdateListDto } from './update-list.dto';
import { ReplaceListDto } from './replace-list.dto';
import { ListRepository } from './list.repository';
import { CreateListDto } from './create-list.dto';

@Injectable()
export class ListService {
  constructor(
    private readonly em: EntityManager,
    private readonly repo: ListRepository,
  ) {}

  public async create(dto: CreateListDto, board: Board): Promise<List> {
    try {
      const newList = new List();
      wrap(newList).assign(dto);
      newList.board = Reference.create(board);
      await this.em.begin(); // begin before locking query
      const newPositionResult = await this.repo.lockAndGetPositionSorter(
        // locks rows
        board,
	dto.position,
      );
      newList.position = newPositionResult[0] + 1;
      newList.positionSorter = newPositionResult[1];
      this.em.persist(newList);
      await this.em.commit();
      return newList;
    } catch (e) {
      console.log(e);
      await this.em.rollback();
      throw e;
    }
  }

  public async getOne(listId: number): Promise<List> {
    try {
      await this.em.begin();
      const result = await this.repo.getListById(listId);
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

  public async getMany(board: Board): Promise<List[]> {
    try {
      await this.em.begin();
      const result = await this.repo.getListsByBoardWithPosition(board);
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

  public async update(
    list: List,
    board: Board,
    dto: UpdateListDto,
  ): Promise<List> {
    try {
      const dtoHasPosition = dto.position;
      const positionChanged = dto.position !== list.position;
      wrap(list).assign(dto);
      await this.em.begin();
      if (dtoHasPosition && positionChanged) {
        const newPositionResult = await this.repo.lockAndGetPositionSorter(
          // locks rows
          board,
          dto.position,
        );
        list.position = newPositionResult[0];
        list.positionSorter = newPositionResult[1];
      }
      // this.em.persist(list); unnecessary
      await this.em.commit();
      return list;
    } catch (e) {
      await this.em.rollback();
      throw e;
    }
  }

  public async replace(
    list: List,
    board: Board,
    dto: ReplaceListDto,
  ): Promise<List> {
    try {
      wrap(list).assign(dto);
      await this.em.begin();
      const newPositionResult = await this.repo.lockAndGetPositionSorter(
        // locks rows
        board,
        dto.position,
      );
      list.position = newPositionResult[0];
      list.positionSorter = newPositionResult[1];
      // this.em.persist(list); unnecessary
      await this.em.commit();
      return list;
    } catch (e) {
      await this.em.rollback();
      throw e;
    }
  }

  public async delete(list: List): Promise<undefined> {
    try {
      await this.em.begin();
      this.em.remove(list);
      await this.em.commit();
      return;
    } catch (e) {
      await this.em.rollback();
      throw e;
    }
  }
}
