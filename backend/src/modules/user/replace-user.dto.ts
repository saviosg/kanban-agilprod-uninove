import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

export const replaceUserValidationSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  lastName: z.string().min(1).nullable(),
  password: z.string().min(10),
});

export type ReplaceUserDto = z.infer<typeof replaceUserValidationSchema>;

export class ReplaceUserDescriptionSchema implements ReplaceUserDto {
  @ApiProperty({ format: 'email', })
  email!: string;

  @ApiProperty({ minLength: 1 })
  name!: string;

  @ApiProperty({ minLength: 1, nullable: true, })
  lastName!: string;

  @ApiProperty({ format: 'password', minLength: 10 })
  password!: string;
}
