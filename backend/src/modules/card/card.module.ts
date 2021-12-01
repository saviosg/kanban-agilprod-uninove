import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardCollectionController, CardInstanceController } from './card.controller';
import { BoardModule } from 'src/modules/board/board.module';
import { ListModule } from 'src/modules/list/list.module';
import { BoardService } from 'src/modules/board/board.service';
import { ListService } from 'src/modules/list/list.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Card } from './card.entity';

@Module({
  providers: [CardService, BoardService, ListService],
  controllers: [CardCollectionController, CardInstanceController],
  imports: [MikroOrmModule.forFeature([Card]), BoardModule, ListModule],
})
export class CardModule {}
