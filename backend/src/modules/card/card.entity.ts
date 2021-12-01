import {
  Entity,
  Property,
  ManyToOne,
  PrimaryKey,
  IdentifiedReference,
  EntityRepositoryType,
} from '@mikro-orm/core';
import { CardRepository } from './card.repository';
import { List } from 'src/modules/list/list.entity';

@Entity({ customRepository: () => CardRepository })
export class Card {
  [EntityRepositoryType]?: CardRepository;

  @PrimaryKey()
  id!: number;

  @Property({ nullable: true })
  info?: string;

  @Property({ nullable: true })
  color?: string;

  @ManyToOne(() => List, { wrappedReference: true, onDelete: 'cascade', eager: false, hidden: true, })
  list!: IdentifiedReference<List>;
}
