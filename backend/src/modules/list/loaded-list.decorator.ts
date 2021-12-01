import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { List } from './list.entity';

export const LoadedList = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: { list: List } = ctx.switchToHttp().getRequest();
    return request.list;
  },
);
