import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';
import { List } from '../list/list.entity';

export const replaceCardValidationSchema = z.object({
  info: z.string().min(1).nullable(),
  listId: z.number().gt(0),
  color: z.string().min(1).nullable(),
});

export type ReplaceCardDtoWithListId = z.infer<typeof replaceCardValidationSchema>;
export type ReplaceCardDtoWithList = Omit<ReplaceCardDtoWithListId, 'listId'> & { list?: List };

export class ReplaceCardDescriptionSchema implements ReplaceCardDtoWithListId {
  @ApiProperty({ minLength: 1, nullable: true, })
  info!: string;

  @ApiProperty({ minimum: 1 })
  listId!: number;

  @ApiProperty({ minLength: 1, nullable: true, })
  color!: string;
}
