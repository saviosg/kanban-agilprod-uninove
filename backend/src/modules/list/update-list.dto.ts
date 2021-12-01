import { ApiPropertyOptional } from '@nestjs/swagger';
import { z } from 'zod';

export const updateListValidationSchema = z.object({
  title: z.string().min(1),
  color: z.string().min(1).nullable(),
  position: z.number().gt(0).nullable(),
}).partial();

export type UpdateListDto = z.infer<typeof updateListValidationSchema>;

export class UpdateListDescriptionSchema implements UpdateListDto {
  @ApiPropertyOptional({ minLength: 1 })
  title?: string;

  @ApiPropertyOptional({ minLength: 1, nullable: true, })
  color?: string;

  @ApiPropertyOptional({ minimum: 1, nullable: true, })
  position?: number;
}
