import { Reference } from '@mikro-orm/core';
import { List } from 'src/modules/list/list.entity';
import { Card } from './card.entity';
import { EntityRepository } from '@mikro-orm/postgresql';

export class CardRepository extends EntityRepository<Card> {
  public async cardBelongsToList(list: List, card: Card): Promise<boolean> {
    await card.list.load();
    const belongs = card.list.unwrap() === list;
    return belongs;
  }

  public async getCardById(cardId: number): Promise<Card | null> {
    const result = await this.em.findOne(Card, {
      id: cardId,
    });
    return result;
  }

  public async getCardsByList(list: List): Promise<Card[] | null> {
    const result = await this.em.find(Card, {
      list: list,
    });
    return result;
  }

  public async getCardsByListId(listId: number): Promise<Card[] | null> {
    const result = await this.em.find(Card, {
      list: listId,
    });
    return result;
  }

  public async addCardToList(card: Card, list: List): Promise<Card> {
    card.list = Reference.create(list);
    this.em.persist(card);
    return card;
  }
}
