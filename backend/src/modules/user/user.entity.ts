import {
  Entity,
  Property,
  OneToMany,
  Unique,
  PrimaryKey,
  Collection,
  EntityRepositoryType,
} from '@mikro-orm/core';
import { UserRepository } from './user.repository';
import { Board } from 'src/modules/board/board.entity';

@Entity({ customRepository: () => UserRepository })
export class User {
  [EntityRepositoryType]: UserRepository;

  @PrimaryKey()
  id!: number;

  @Property()
  @Unique()
  email!: string;

  @Property({ lazy: true, hidden: true, })
  password!: string;

  @Property()
  name!: string;

  @Property({ nullable: true, })
  lastName?: string;

  @OneToMany(() => Board, (board) => board.owner, { orphanRemoval: true, eager: false, hidden: true, })
  boards = new Collection<Board>(this);
}
