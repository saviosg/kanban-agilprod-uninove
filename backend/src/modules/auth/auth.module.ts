import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { HashingModule } from 'src/modules/hashing/hashing.module';
import { HashingService } from 'src/modules/hashing/hashing.service';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '10m' },
    }),
    HashingModule,
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, HashingService],
  controllers: [AuthController],
})
export class AuthModule {}
