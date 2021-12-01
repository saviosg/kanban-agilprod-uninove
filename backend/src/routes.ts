import { AuthModule } from './modules/auth/auth.module';
import { BoardModule } from './modules/board/board.module';
import { CardModule } from './modules/card/card.module';
import { ListModule } from './modules/list/list.module';

export const routes = [
  {
    path: '/auth',
    module: AuthModule,
  },
  {
    path: '/boards',
    module: BoardModule,
    children: [
      {
        path: '/:boardId/lists',
        module: ListModule,
        children: [
          {
            path: '/:listId/cards',
            module: CardModule,
          },
        ],
      },
    ],
  },
];
