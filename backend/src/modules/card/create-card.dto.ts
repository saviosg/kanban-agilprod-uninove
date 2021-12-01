import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { z } from 'zod';

export const createCardValidationSchema = z.object({
  info: z.string().min(1),
  color: z.string().min(1).optional(),
});

export type CreateCardDto = z.infer<typeof createCardValidationSchema>;

export class CreateCardDescriptionSchema implements CreateCardDto {
  @ApiProperty({ minLength: 1 })
  info!: string;

  @ApiPropertyOptional({ minLength: 1 })
  color?: string;
}
