import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

export const replaceListValidationSchema = z.object({
  title: z.string().min(1),
  color: z.string().min(1).nullable(),
  position: z.number().gt(0).nullable(),
});

export type ReplaceListDto = z.infer<typeof replaceListValidationSchema>;

export class ReplaceListDescriptionSchema implements ReplaceListDto {
  @ApiProperty({ minLength: 1 })
  title!: string;

  @ApiProperty({ minLength: 1, nullable: true, })
  color!: string;

  @ApiProperty({ minimum: 1, nullable: true, })
  position!: number;
}
