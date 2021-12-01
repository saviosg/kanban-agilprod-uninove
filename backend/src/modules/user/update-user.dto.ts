import { ApiPropertyOptional } from '@nestjs/swagger';
import { z } from 'zod';

export const updateUserValidationSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  lastName: z.string().min(1).nullable(),
  password: z.string().min(10),
}).partial();

export type UpdateUserDto = z.infer<typeof updateUserValidationSchema>;

export class UpdateUserDescriptionSchema implements UpdateUserDto {
  @ApiPropertyOptional({ format: 'email', })
  email?: string;

  @ApiPropertyOptional({ minLength: 1 })
  name?: string;

  @ApiPropertyOptional({ minLength: 1, nullable: true, })
  lastName?: string;

  @ApiPropertyOptional({ format: 'password', minLength: 10 })
  password?: string;
}
