import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { mikroOrmConfig } from './mikro-orm.config';
import { UserModule } from './modules/user/user.module';
import { BoardModule } from './modules/board/board.module';
import { ListModule } from './modules/list/list.module';
import { CardModule } from './modules/card/card.module';
import { RouterModule } from '@nestjs/core';
import { routes } from './routes';
import { AuthModule } from './modules/auth/auth.module';
import { HashingModule } from './modules/hashing/hashing.module';

@Module({
  imports: [
    MikroOrmModule.forRoot(mikroOrmConfig),
    UserModule,
    BoardModule,
    ListModule,
    CardModule,
    RouterModule.register(routes),
    AuthModule,
    HashingModule,
  ],
})
export class AppModule {}
