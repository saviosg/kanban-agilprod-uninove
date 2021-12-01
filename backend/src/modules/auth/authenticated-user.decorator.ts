import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/modules/user/user.entity';

export const AuthenticatedUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: { user: User } = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
