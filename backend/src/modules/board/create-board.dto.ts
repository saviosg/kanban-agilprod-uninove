import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { z } from 'zod';

export const createBoardValidationSchema = z.object({
  title: z.string().min(1),
  color: z.string().min(1).optional(),
});

export type CreateBoardDto = z.infer<typeof createBoardValidationSchema>;

export class CreateBoardDescriptionSchema implements CreateBoardDto {
  @ApiProperty({ minLength: 1 })
  title!: string;

  @ApiPropertyOptional({ minLength: 1 })
  color?: string;
}
