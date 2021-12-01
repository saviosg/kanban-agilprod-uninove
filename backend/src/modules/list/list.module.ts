import { Module } from '@nestjs/common';
import { ListService } from './list.service';
import { ListCollectionController, ListInstanceController } from './list.controller';
import { BoardModule } from 'src/modules/board/board.module';
import { BoardService } from 'src/modules/board/board.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { List } from './list.entity';

@Module({
  providers: [ListService, BoardService],
  controllers: [ListCollectionController, ListInstanceController],
  imports: [MikroOrmModule.forFeature([List]), BoardModule],
  exports: [MikroOrmModule],
})
export class ListModule {}
