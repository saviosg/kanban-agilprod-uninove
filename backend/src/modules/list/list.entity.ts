import {
  Entity,
  Property,
  ManyToOne,
  OneToMany,
  Collection,
  Unique,
  PrimaryKey,
  IdentifiedReference,
  Formula,
  EntityRepositoryType,
} from '@mikro-orm/core';
import { Card } from 'src/modules/card/card.entity';
import { Board } from 'src/modules/board/board.entity';
import Big from 'big.js';
import { BigFloatType } from 'src/big-float/big-float.type';
import { ListRepository } from 'src/modules/list/list.repository';

@Entity({ customRepository: () => ListRepository })
@Unique({ properties: ['board', 'positionSorter'] })
export class List {
  [EntityRepositoryType]?: ListRepository;

  [key: string]: unknown;

  @PrimaryKey()
  id!: number;

  @Property()
  title!: string;

  @Property({ nullable: true })
  color?: string;

  @Formula(
    'row_number() OVER (PARTITION BY board_board_id ORDER BY position_sorter)',
    {
      lazy: true,
      persist: false,
    },
  )
  position?: number;

  @Property({ type: BigFloatType, hidden: true })
  positionSorter!: Big;

  @ManyToOne(() => Board, { wrappedReference: true, eager: false, hidden: true, })
  board!: IdentifiedReference<Board>;

  @OneToMany(() => Card, (card) => card.list, { orphanRemoval: true, eager: false, hidden: true, })
  cards = new Collection<Card>(this);
}
