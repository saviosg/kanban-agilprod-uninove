import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  UseGuards,
  Put,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BoardAuthorizationGuard } from 'src/modules/board/board-authorization.guard';
import { LoadedBoard } from 'src/modules/board/loaded-board.decorator';
import { Board } from 'src/modules/board/board.entity';
import { ListService } from './list.service';
import { ListAuthorizationGuard } from './list-authorization.guard';
import { ZodValidationPipe } from 'src/validation/zod-validation.pipe';
import { List } from './list.entity';
import { LoadedList } from './loaded-list.decorator';
import { ReplaceListDescriptionSchema, replaceListValidationSchema } from './replace-list.dto';
import { UpdateListDescriptionSchema, updateListValidationSchema } from './update-list.dto';
import { CreateListDescriptionSchema, createListValidationSchema } from './create-list.dto';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('list collection')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), BoardAuthorizationGuard)
@Controller()
export class ListCollectionController {
  constructor(private readonly listService: ListService) {}

  @Get() // URL/board/:boardId/lists
  public async getLists(@LoadedBoard() board: Board) {
    return await this.listService.getMany(board);
  }

  @Post() // URL/boards/:boardId/lists
  async createList(
    @Body(new ZodValidationPipe(createListValidationSchema)) dto: CreateListDescriptionSchema,
    @LoadedBoard() board: Board,
  ) {
    return await this.listService.create(dto, board);
  }
}

@ApiTags('list instance')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), BoardAuthorizationGuard, ListAuthorizationGuard)
@Controller()
export class ListInstanceController {
  constructor(private readonly listService: ListService) {}

  @Get(':listId') // URL/boards/:boardId/lists/:listId
  @ApiParam({ type: 'integer', name: 'boardId' })
  @ApiParam({ type: 'integer', name: 'listId' })
  async getList(@LoadedList() list: List) {
    return list;
  }

  @Patch(':listId') // URL/boards/:boardId/lists/:listId
  @ApiParam({ type: 'integer', name: 'boardId' })
  @ApiParam({ type: 'integer', name: 'listId' })
  async updateList(
    @Body(new ZodValidationPipe(updateListValidationSchema)) dto: UpdateListDescriptionSchema,
    @LoadedBoard() board: Board,
    @LoadedList() list: List,
  ) {
    return await this.listService.update(list, board, dto);
  }

  @Put(':listId') // URL/boards/:boardId/lists/:listId
  @ApiParam({ type: 'integer', name: 'boardId' })
  @ApiParam({ type: 'integer', name: 'listId' })
  async replaceList(
    @Body(new ZodValidationPipe(replaceListValidationSchema)) dto: ReplaceListDescriptionSchema,
    @LoadedBoard() board: Board,
    @LoadedList() list: List,
  ) {
    return await this.listService.replace(list, board, dto);
  }

  @Delete(':listId') // URL/boards/:boardId/lists/:listId
  @ApiParam({ type: 'integer', name: 'boardId' })
  @ApiParam({ type: 'integer', name: 'listId' })
  async deleteList(@LoadedList() list: List) {
    return await this.listService.delete(list);
  }
}
