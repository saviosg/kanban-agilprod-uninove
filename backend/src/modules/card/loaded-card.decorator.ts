import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Card } from './card.entity';

export const LoadedCard = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: { card: Card } = ctx.switchToHttp().getRequest();
    return request.card;
  },
);
