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
import { ListAuthorizationGuard } from 'src/modules/list/list-authorization.guard';
import { LoadedList } from 'src/modules/list/loaded-list.decorator';
import { BoardAuthorizationGuard } from 'src/modules/board/board-authorization.guard';
import { List } from 'src/modules/list/list.entity';
import { Card } from 'src/modules/card/card.entity';
import { ZodValidationPipe } from 'src/validation/zod-validation.pipe';
import { CardAuthorizationGuard } from './card-authorization.guard';
import { CardService } from './card.service';
import { LoadListPipe } from './load-list.pipe';
import { LoadedCard } from './loaded-card.decorator';
import { ReplaceCardDtoWithList, ReplaceCardDescriptionSchema, replaceCardValidationSchema } from './replace-card.dto';
import { UpdateCardDtoWithList, UpdateCardDescriptionSchema, updateCardValidationSchema } from './update-card.dto';
import { CreateCardDescriptionSchema, createCardValidationSchema } from './create-card.dto';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('card collection')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), BoardAuthorizationGuard, ListAuthorizationGuard)
@Controller()
export class CardCollectionController {
  constructor(private readonly cardService: CardService) {}

  @Get() // URL/boards/:boardId/lists/:listId/cards/
  async getCards(@LoadedList() list: List) {
    return await this.cardService.getMany(list);
  }

  @Post() // URL/boards/:boardId/lists/:listId/cards
  async createCard(
    @Body(new ZodValidationPipe(createCardValidationSchema)) dto: CreateCardDescriptionSchema,
    @LoadedList() list: List,
  ) {
    return await this.cardService.create(dto, list);
  }
}

@ApiTags('card instance')
@ApiBearerAuth()
@UseGuards(
  AuthGuard('jwt'),
  BoardAuthorizationGuard,
  ListAuthorizationGuard,
  CardAuthorizationGuard,
)
@Controller()
export class CardInstanceController {
  constructor(private readonly cardService: CardService) {}

  @Get(':cardId') // URL/boards/:boardId/lists/:listId/cards/:cardId
  @ApiParam({ type: 'integer', name: 'boardId' })
  @ApiParam({ type: 'integer', name: 'listId' })
  @ApiParam({ type: 'integer', name: 'cardId' })
  async getCard(@LoadedCard() card: Card): Promise<Card> {
    return card;
  }

  @Put(':cardId') // URL/boards/:boardId/lists/:listId/cards/:cardId
  @ApiParam({ type: 'integer', name: 'boardId' })
  @ApiParam({ type: 'integer', name: 'listId' })
  @ApiParam({ type: 'integer', name: 'cardId' })
  async replaceCard(
    @Body(new ZodValidationPipe(replaceCardValidationSchema), LoadListPipe)
    replaceCardDto: ReplaceCardDtoWithList,
    @LoadedCard() card: Card,
  ) {
    return await this.cardService.replace(card, replaceCardDto);
  }

  @Patch(':cardId') // URL/boards/:boardId/lists/:listId/cards/:cardId
  @ApiParam({ type: 'integer', name: 'boardId' })
  @ApiParam({ type: 'integer', name: 'listId' })
  @ApiParam({ type: 'integer', name: 'cardId' })
  @ApiBody({ type: UpdateCardDescriptionSchema })
  async updateCard(
    @Body(new ZodValidationPipe(updateCardValidationSchema), LoadListPipe)
    updateCardDto: UpdateCardDtoWithList,
    @LoadedCard() card: Card,
  ) {
    return await this.cardService.update(card, updateCardDto);
  }

  @Delete(':cardId') // URL/boards/:boardId/lists/:listId/cards/:cardId
  @ApiParam({ type: 'integer', name: 'boardId' })
  @ApiParam({ type: 'integer', name: 'listId' })
  @ApiParam({ type: 'integer', name: 'cardId' })
  async deleteCard(@LoadedCard() card: Card) {
    return await this.cardService.delete(card);
  }
}
