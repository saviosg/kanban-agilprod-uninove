import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticatedUser } from 'src/modules/auth/authenticated-user.decorator';
import { Board } from './board.entity';
import { User } from 'src/modules/user/user.entity';
import { ZodValidationPipe } from 'src/validation/zod-validation.pipe';
import { BoardAuthorizationGuard } from './board-authorization.guard';
import { BoardService } from './board.service';
import { CreateBoardDescriptionSchema, createBoardValidationSchema } from './create-board.dto';
import { LoadedBoard } from './loaded-board.decorator';
import { ReplaceBoardDescriptionSchema, replaceBoardValidationSchema } from './replace-board.dto';
import { UpdateBoardDescriptionSchema, updateBoardValidationSchema } from './update-board.dto';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('board collection')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller() // URL/boards
export class BoardCollectionController {
  constructor(private readonly boardService: BoardService) {}

  @Get()
  async getBoards(@AuthenticatedUser() user: User) {
    return await this.boardService.getMany(user);
  }

  @Post()
  async createBoard(
    @Body(new ZodValidationPipe(createBoardValidationSchema)) dto: CreateBoardDescriptionSchema,
    @AuthenticatedUser() user: User,
  ) {
    return await this.boardService.create(dto, user);
  }

}

@ApiTags('board instance')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), BoardAuthorizationGuard)
@Controller() // URL/boards/:boardId
export class BoardInstanceController {
  constructor(private readonly boardService: BoardService) {}

  @Get(':boardId')
  @ApiParam({ type: 'integer', name: 'boardId' })
  async getBoard(
    @LoadedBoard() board: Board,
  ): Promise<Board> {
    return board;
  }

  @Put(':boardId')
  @ApiParam({ type: 'integer', name: 'boardId' })
  async replaceBoard(
    @Body(new ZodValidationPipe(replaceBoardValidationSchema))
    replaceBoardDto: ReplaceBoardDescriptionSchema,
    @LoadedBoard() board: Board,
  ) {
    return await this.boardService.replace(board, replaceBoardDto);
  }

  @Patch(':boardId')
  @ApiParam({ type: 'integer', name: 'boardId' })
  async updateBoard(
    @Body(new ZodValidationPipe(updateBoardValidationSchema))
    updateBoardDto: UpdateBoardDescriptionSchema,
    @LoadedBoard() board: Board,
  ) {
    return await this.boardService.update(board, updateBoardDto);
  }

  @Delete(':boardId')
  @ApiParam({ type: 'integer', name: 'boardId' })
  async deleteBoard(
    @LoadedBoard() board: Board,
  ) {
    return await this.boardService.delete(board);
  }
}
