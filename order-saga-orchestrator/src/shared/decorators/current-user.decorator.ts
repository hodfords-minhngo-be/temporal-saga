import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from '~domains/users/entities/user.entity';

export const CurrentUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const { user } = ctx.switchToHttp().getRequest<{ user: UserEntity }>();

    return data ? user && user[data as keyof UserEntity] : user;
  },
);
