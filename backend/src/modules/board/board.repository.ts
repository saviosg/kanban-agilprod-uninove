import { EntityRepository } from '@mikro-orm/postgresql';
import { Board } from './board.entity';
import { User } from 'src/modules/user/user.entity';

export class BoardRepository extends EntityRepository<Board> {
  public async userOwnsBoard(user: User, board: Board): Promise<boolean> {
    await board.owner.load();
    const owner = board.owner.unwrap();
    const userIsOwner = user === owner;
    return userIsOwner;
  }

  public async getBoardById(boardId: number): Promise<Board | undefined> {
    const result = await this.em.findOne(Board, {
      boardId: boardId,
    });
    return result || undefined;
  }

  public async getBoardsByOwner(owner: User): Promise<Board[]> {
    const result = await this.em.find(Board, { owner: owner });
    return result;
  }
}
