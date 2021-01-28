import { NestFactory } from '@nestjs/core';
import { graphql, buildSchema } from 'graphql';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app.module';
import { ForbiddenException } from '@nestjs/common';
import fetch from 'node-fetch';

const query = '{ user { id notifications } }';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: false,
  });
  await app.listen(3000);
  await test();
  const res = await fetch('http://localhost:3000/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query,
      variables: {},
    }),
  });
  const data = await res.json();
  console.log('');
  console.log(
    '`user` property is returned as unexpectedly returned as null with @nestjs/graphql:',
  );
  console.log(
    JSON.stringify({
      ...data,
      errors: data.errors.map((error) => {
        // stripping extensions out of result for better console readability
        const { extensions, ...err } = error;
        return err;
      }),
    }),
  );
  console.log(
    '------------------------------------------------------------------------------------------------------------------------^',
  );
  process.exit(0);
}

async function test() {
  const schema = buildSchema(`
    type User {
      id: ID!
      name: String!
      notifications(foo: Boolean): String
    }
    type Query {
      user: User
    }
  `);
  const root = {
    user: () => ({
      id: '1',
      name: 'Hans',
      notifications: () => {
        throw new ForbiddenException();
      },
    }),
  };

  try {
    const response = await graphql(schema, query, root);

    console.log(
      'As expected, vanilla implementation returns `null` only for the `notifications` field:',
    );
    console.log(JSON.stringify(response));
    console.log(
      '--------------------------------------------------------------------------------------------------------------------------------------------------^',
    );
  } catch (e) {
    console.error(e);
  }
}

bootstrap();
