import { it, expect } from 'vitest';
import { deployMigrations } from '../src/index';
import { faker } from '@faker-js/faker';
it('should throw an error when providing incomplete credentials', () => {
  expect(() => deployMigrations({} as any, {} as any)).toThrowError();
});

it('should not throw an error when providing incomplete credentials', () => {
  expect(() =>
    deployMigrations(
      {
        host: faker.internet.ipv4(),
        password: faker.internet.password(),
        port: faker.internet.port(),
        url: faker.internet.url(),
        username: faker.internet.userName(),
      },
      { host: faker.internet.ipv4(), privateKey: faker.lorem.paragraph() }
    )
  ).not.toThrowError();
});
