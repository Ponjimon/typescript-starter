import { ForbiddenException } from '@nestjs/common';
import { Query, ResolveField, Resolver } from '@nestjs/graphql';
import { User } from './user.type';

@Resolver(User)
export class UserResolver {
  @Query(() => User, { nullable: true })
  user() {
    const user = new User();
    user.id = '1';
    user.name = 'Hans';

    return user;
  }

  @ResolveField(() => String)
  notifications() {
    throw new ForbiddenException();
    return 'foo';
  }
}
