import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardCollectionController, BoardInstanceController } from './board.controller';
import { Board } from './board.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
  imports: [MikroOrmModule.forFeature([Board])],
  providers: [BoardService],
  controllers: [BoardCollectionController, BoardInstanceController],
  exports: [MikroOrmModule],
})
export class BoardModule {}
