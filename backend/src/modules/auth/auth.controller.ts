import { Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticatedUser } from './authenticated-user.decorator';
import { AuthService } from './auth.service';
import { User } from 'src/modules/user/user.entity';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthenticateUserDescriptionSchema } from './authenticate-user.dto';

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('refresh-token')
  @ApiBody({ type: AuthenticateUserDescriptionSchema })
  async getRefreshToken(@AuthenticatedUser() user: User) {
    return await this.authService.getToken(user, {
      expiresIn: '14d',
    });
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('access-token')
  async getAccessToken(@AuthenticatedUser() user: User) {
    return await this.authService.getToken(user);
  }
}
