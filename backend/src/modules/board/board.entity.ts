import {
  Entity,
  Property,
  ManyToOne,
  OneToMany,
  Collection,
  PrimaryKey,
  IdentifiedReference,
  EntityRepositoryType,
} from '@mikro-orm/core';
import { BoardRepository } from './board.repository';
import { List } from 'src/modules/list/list.entity';
import { User } from 'src/modules/user/user.entity';

@Entity({ customRepository: () => BoardRepository })
export class Board {
  [EntityRepositoryType]!: BoardRepository;

  [key: string]: unknown;

  @PrimaryKey()
  id!: number;

  @Property()
  title!: string;

  @Property({ nullable: true, })
  color!: string;

  @ManyToOne(() => User, { wrappedReference: true, onDelete: 'cascade', eager: false, hidden: true, })
  owner!: IdentifiedReference<User>;

  @OneToMany(() => List, (list) => list.board, { eager: false, hidden: true, })
  lists = new Collection<List>(this);
}
