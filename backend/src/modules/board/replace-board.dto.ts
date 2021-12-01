import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

export const replaceBoardValidationSchema = z.object({
  title: z.string().min(1),
  color: z.string().min(1).nullable(),
});

export type ReplaceBoardDto = z.infer<typeof replaceBoardValidationSchema>;

export class ReplaceBoardDescriptionSchema implements ReplaceBoardDto {
  @ApiProperty({ minLength: 1 })
  title!: string;

  @ApiProperty({ minLength: 1, nullable: true })
  color!: string;
}
