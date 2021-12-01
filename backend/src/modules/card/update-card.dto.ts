import { ApiPropertyOptional } from '@nestjs/swagger';
import { z } from 'zod';
import { List } from '../list/list.entity';

export const updateCardValidationSchema = z.object({
  info: z.string().min(1).nullable(),
  listId: z.number().gt(0),
  color: z.string().min(1).nullable(),
}).partial();

export type UpdateCardDtoWithListId = z.infer<typeof updateCardValidationSchema>;
export type UpdateCardDtoWithList = Omit<UpdateCardDtoWithListId, 'listId'> & { list?: List };

export class UpdateCardDescriptionSchema implements UpdateCardDtoWithListId {
  @ApiPropertyOptional({ minLength: 1, nullable: true, })
  info?: string;

  @ApiPropertyOptional({ minimum: 1 })
  listId?: number;

  @ApiPropertyOptional({ minLength: 1, nullable: true, })
  color?: string;
}
