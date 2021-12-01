import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserCollectionController, UserInstanceController } from './user.controller';
import { HashingModule } from 'src/modules/hashing/hashing.module';
import { HashingService } from 'src/modules/hashing/hashing.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from './user.entity';

@Module({
  providers: [UserService, HashingService],
  controllers: [UserCollectionController, UserInstanceController],
  imports: [MikroOrmModule.forFeature([User]), HashingModule],
  exports: [MikroOrmModule, UserService],
})
export class UserModule {}
