import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { z } from 'zod';

export const createListValidationSchema = z.object({
  title: z.string().min(1),
  color: z.string().min(1).optional(),
  position: z.number().gt(0).optional(),
});

export type CreateListDto = z.infer<typeof createListValidationSchema>;

export class CreateListDescriptionSchema implements CreateListDto {
  @ApiProperty({ minLength: 1 })
  title!: string;

  @ApiPropertyOptional({ minLength: 1 })
  color?: string;

  @ApiPropertyOptional({ minimum: 1 })
  position?: number;
}
