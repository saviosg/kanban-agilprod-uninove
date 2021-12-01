import { MikroOrmModuleSyncOptions } from "@mikro-orm/nestjs";

export const mikroOrmConfig: MikroOrmModuleSyncOptions = {
  entities: ['./dist/modules/**/*.entity.js'],
  entitiesTs: ['./src/modules/**/*.entity.ts'],
  type: 'postgresql',
  dbName: 'agilprod',
  host: '172.17.0.2',
  port: 5432,
  password: 'agilprod',
  //clientUrl: 'postgresql://postgres:agilprod@172.17.0.2:5432/agilprod',
};
