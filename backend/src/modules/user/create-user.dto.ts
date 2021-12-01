import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { z } from 'zod';

export const createUserValidationSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  lastName: z.string().min(1).optional(),
  password: z.string().min(10),
});

export type CreateUserDto = z.infer<typeof createUserValidationSchema>;

export class CreateUserDescriptionSchema implements CreateUserDto {
  @ApiProperty({ format: 'email', })
  email!: string;

  @ApiProperty({ minLength: 1 })
  name!: string;

  @ApiPropertyOptional({ minLength: 1 })
  lastName?: string;

  @ApiProperty({ format: 'password', minLength: 10 })
  password!: string;
}
