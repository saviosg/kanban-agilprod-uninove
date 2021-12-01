import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Board } from './board.entity';

export const LoadedBoard = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: { board: Board } = ctx.switchToHttp().getRequest();
    return request.board;
  },
);
