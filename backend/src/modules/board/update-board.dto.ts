import { ApiPropertyOptional } from '@nestjs/swagger';
import { z } from 'zod';

export const updateBoardValidationSchema = z.object({
  title: z.string().min(1),
  color: z.string().min(1).nullable(), // to remove
}).partial();

export type UpdateBoardDto = z.infer<typeof updateBoardValidationSchema>;

export class UpdateBoardDescriptionSchema implements UpdateBoardDto {
  @ApiPropertyOptional({ minLength: 1 })
  title?: string;

  @ApiPropertyOptional({ minLength: 1, nullable: true, })
  color?: string;
}
