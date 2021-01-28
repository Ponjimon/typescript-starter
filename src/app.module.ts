import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { UserResolver } from './user.resolver';
@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      path: '/',
      playground: false,
      tracing: false,
      debug: false,
      introspection: true,
    }),
  ],
  providers: [UserResolver],
})
export class AppModule {}
