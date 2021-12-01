import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

export const authenticateUserValidationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(10),
});

export type AuthenticateUserDto = z.infer<typeof authenticateUserValidationSchema>;

export class AuthenticateUserDescriptionSchema implements AuthenticateUserDto {
  @ApiProperty({ format: 'email', })
  email!: string;

  @ApiProperty({ format: 'password', minLength: 10 })
  password!: string;
}
