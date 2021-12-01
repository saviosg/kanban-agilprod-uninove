import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticatedUser } from 'src/modules/auth/authenticated-user.decorator';
import { User } from './user.entity';
import { ZodValidationPipe } from 'src/validation/zod-validation.pipe';
import { CreateUserDescriptionSchema, createUserValidationSchema } from './create-user.dto';
import { ReplaceUserDescriptionSchema, replaceUserValidationSchema } from './replace-user.dto';
import { UpdateUserDescriptionSchema, updateUserValidationSchema } from './update-user.dto';
import { UserRegistrationGuard } from './user-registration.guard';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('user collection')
@Controller('users')
export class UserCollectionController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(UserRegistrationGuard)
  @Post() // URL/users/
  public async createUser(
    @Body(new ZodValidationPipe(createUserValidationSchema)) createUserDto: CreateUserDescriptionSchema,
  ) {
    return await this.userService.create(createUserDto);
  }
}

@ApiTags('user instance (self)')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UserInstanceController {
  constructor(private readonly userService: UserService) {}

  @Get('me') // URL/users/me
  async getUser(@AuthenticatedUser() user: User) {
    return user;
  }

  @Patch('me') // URL/users/me
  async updateUser(
    @Body(new ZodValidationPipe(updateUserValidationSchema)) dto: UpdateUserDescriptionSchema,
    @AuthenticatedUser() user: User,
  ) {
    return await this.userService.update(user, dto);
  }

  @Patch('me') // URL/users/me
  async replaceUser(
    @Body(new ZodValidationPipe(replaceUserValidationSchema)) dto: ReplaceUserDescriptionSchema,
    @AuthenticatedUser() user: User,
  ) {
    return await this.userService.replace(user, dto);
  }

  @Delete('me') // URL/users/me
  async deleteuser(@AuthenticatedUser() user: User) {
    return await this.userService.delete(user);
  }
}
