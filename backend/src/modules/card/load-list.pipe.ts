import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { ListService } from 'src/modules/list/list.service';
import { ReplaceCardDtoWithListId, ReplaceCardDtoWithList} from './replace-card.dto';
import { UpdateCardDtoWithListId, UpdateCardDtoWithList } from './update-card.dto';

@Injectable()
export class LoadListPipe implements PipeTransform {
  constructor(private readonly listService: ListService) {}

  async transform(
    value: ReplaceCardDtoWithListId | UpdateCardDtoWithListId,
    metadata: ArgumentMetadata,
  ): Promise<ReplaceCardDtoWithList | UpdateCardDtoWithList> {
    if (!value.listId) {
      return value;
    }

    const list = await this.listService.getOne(value.listId);

    const { listId, ...dto } = {
      ...value,
      list: list,
    };

    return dto;
  }
}
