import { EntityManager } from '@mikro-orm/knex';
import { wrap } from '@mikro-orm/core';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateCardDtoWithList } from './update-card.dto';
import { ReplaceCardDtoWithList } from './replace-card.dto';
import { List } from 'src/modules/list/list.entity';
import { Card } from './card.entity';
import { CardRepository } from './card.repository';
import { ListRepository } from 'src/modules/list/list.repository';
import { CreateCardDto } from './create-card.dto';

@Injectable()
export class CardService {
  constructor(
    private readonly em: EntityManager,
    private readonly repo: CardRepository,
    private readonly listRepo: ListRepository,
  ) {}

  public async delete(card: Card): Promise<undefined> {
    try {
      await this.em.begin();
      this.em.remove(card);
      await this.em.commit();
      return;
    } catch (e) {
      await this.em.rollback();
      throw e;
    }
  }

  public async getOne(cardId: number): Promise<Card> {
    try {
      await this.em.begin();
      const result = await this.repo.getCardById(cardId);
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

  public async getMany(list: List): Promise<Card[]> {
    try {
      await this.em.begin();
      const result = await this.repo.getCardsByList(list);
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

  public async create(dto: CreateCardDto, list: List): Promise<Card> {
    try {
      const card = new Card();
      wrap(card).assign(dto);
      await this.em.begin();
      await this.repo.addCardToList(card, list);
      await this.em.commit();
      return card;
    } catch (e) {
      await this.em.rollback();
      throw e;
    }
  }

  public async update(card: Card, dto: UpdateCardDtoWithList): Promise<Card> {
    try {
      if (dto.list) {
        await this.em.begin();
        const currentList = await card.list.load();
        const board = await currentList.board.load();
        const belongs = await this.listRepo.listBelongsToBoard(dto.list, board);
        if (!belongs) {
          throw new ForbiddenException();
        }
        await this.em.commit();
      }
      wrap(card).assign(dto);
      await this.em.begin();
      //this.em.persist(card); unnecessary
      await this.em.commit();
      return card;
    } catch (e) {
      await this.em.rollback();
      throw e;
    }
  }

  public async replace(card: Card, dto: ReplaceCardDtoWithList): Promise<Card> {
    try {
      if (dto.list) {
        await this.em.begin();
        const currentList = await card.list.load();
        const board = await currentList.board.load();
        const belongs = await this.listRepo.listBelongsToBoard(dto.list, board);
        if (!belongs) {
          throw new ForbiddenException();
        }
        await this.em.commit();
      }
      wrap(card).assign(dto);
      await this.em.begin();
      //this.entityManager.persist(card); unnecessary
      await this.em.commit();
      return card;
    } catch (e) {
      await this.em.rollback();
      throw e;
    }
  }
}
