import { EntityRepository } from '@mikro-orm/postgresql';
import { List } from './list.entity';
import Big from 'big.js';
import { Board } from 'src/modules/board/board.entity';

export class ListRepository extends EntityRepository<List> {
  /*
   * prevents UNIQUE constraint violation
   * tries to lock row N of highest position in which (N.position < requestedPosition)
   * if no row is found, board will be locked for insertion of 1st list
   * there's no guarantee the position will be exactly the same as requested
   */
  public async lockAndGetPositionSorter(
    board: Board,
    requestedPosition?: number | null,
  ): Promise<[position: number, positionSorter: Big]> {
    const qb = this.createQueryBuilder();

    const selectQuery = `
      SELECT
        id,
        board_id,
        position_sorter, 
        row_number()
          OVER (PARTITION BY board_id ORDER BY position_sorter)
          AS position
      FROM list
      WHERE board_id = :boardId
    `;

    // req: 5
    // N=10: (1 2 3 4 5) 6 7 8 9 10
    // N=4:  (1 2 3 4 _)
    const requestedPositionFilter = `
      ORDER BY position ASC
      LIMIT :requestedPosition
    `;

    // req: 5
    // N=5: 5 (4) 3 2 1
    // N=4: (4) 3 2 1
    const lowerPositionQuery = `
      SELECT
        o.id,
        o.board_id,
        o.position,
        o.position_sorter
      FROM list b
      INNER JOIN ordered_lists o
        ON b.id = o.id
      WHERE o.position < :requestedPosition
      ORDER BY position DESC
      LIMIT 1
      FOR UPDATE
    `;

    // req: 5
    // N=5: (5) 4 3 2 1
    // N=4: 4 3 2 1
    const equalPositionQuery = `
      SELECT
        o.id,
        o.board_id,
        o.position,
        o.position_sorter
      FROM list b
      INNER JOIN ordered_lists o
        ON b.id = o.id
      WHERE o.position = :requestedPosition
      ORDER BY position DESC
      LIMIT 1
      FOR UPDATE
    `;

    // requestedPosition: 5
    // 1 2 3 4 5 6 7 8 9 10 > 5 6 (one greater than and one equal or less
    const requestedPositionQuery = `
      WITH ordered_lists AS (
        ${selectQuery}
        ${requestedPositionFilter}
      ),
      lower_list AS (${lowerPositionQuery}),
      equal_list AS (${equalPositionQuery})
      (
        SELECT id, board_id, position, position_sorter
        FROM lower_list
      )
      UNION ALL
      (
        SELECT id, board_id, position, position_sorter
        FROM equal_list
      )
      ORDER BY position DESC;
    `;

    // (10) 9 8 7 6 5 4 3 2 1
    const lastPositionFilter = `
      ORDER BY position DESC
      LIMIT 1
    `;

    // (10) 9 8 7 6 5 4 3 2 1
    const lastPositionQuery = `
      WITH ordered_lists AS (
        ${selectQuery}
      )
      SELECT
        id,
        board_id,
        position,
        position_sorter
      FROM ordered_lists
      ${lastPositionFilter}
      FOR UPDATE;
    `;

    const finalQuery = qb.raw(
      requestedPosition ? requestedPositionQuery : lastPositionQuery,
      {
        boardId: board.id,
        requestedPosition: requestedPosition as number,
      },
    );

    const result = await this.em.getConnection().execute<List[]>(finalQuery);

    const lists = result.map((list) => {
      const em = this.em.fork();
      return em.map(List, list);
    });

    const [equal, lower] = lists;
    const bothExist = equal && lower;
    const position = equal?.position || lower?.position;
    const list = equal || lower;

    const lockBoardQuery = qb.raw(
      `
      SELECT
      FROM board
      WHERE id = :boardId
      FOR UPDATE;
    `,
      { boardId: board.id },
    );

    if (!list || !position) {
      // position is here just for type-safety
      await this.em.getConnection().execute(lockBoardQuery);
      return [1, new Big(1)];
    }

    if (bothExist) {
      return [position, equal.positionSorter.add(lower.positionSorter).div(2)];
    }

    // last
    // so we add
    if (!requestedPosition) {
      return [position, list.positionSorter.add(1)];
    }

    // if less than req, add
    // if equal, divide
    if (list.position === requestedPosition) {
      return [position, list.positionSorter.div(2)];
    }

    // less
    return [position, list.positionSorter.add(1)];
  }

  public async listBelongsToBoard(list: List, board: Board): Promise<boolean> {
    const belongs = list.board.unwrap() === board;
    return belongs;
  }

  public async getListById(listId: number): Promise<List | null> {
    const foundList = await this.em.findOne(List, {
      id: listId,
    });
    return foundList;
  }

  public async getListByIdWithPosition(
    listId: number,
  ): Promise<List | undefined> {
    const qb = this.em.createQueryBuilder<List>(List).getKnex();
    const orderedListQuery = qb.with('ordered_lists', (qb) => {
      qb.select('*')
        .rowNumber('position', 'position_sorter', 'board_id')
        .from('list');
    });
    const listSelectionQuery = orderedListQuery
      .select()
      .from('ordered_lists')
      .where('id', listId);
    const result = await this.em.getConnection().execute<List[]>(listSelectionQuery);
    const lists = result.map((list) => this.em.map(List, list));
    return lists[0];
  }

  public async getListsByBoardWithPosition(board: Board): Promise<List[]> {
    const result = await this.em.find(
      List,
      {
        board: board,
      },
      { populate: ['position'] },
    );

    return result;
  }
}
