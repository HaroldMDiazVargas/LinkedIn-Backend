import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { UserEntity } from './models/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { JwtModule } from '@nestjs/jwt';
// import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { SessionSerializer } from './serializers/session.serializer';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { FriendRequestEntity } from './models/friend-request.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, FriendRequestEntity]),
    PassportModule.registerAsync({
      useFactory: () => ({
        session: true
      })
    })
    // JwtModule.registerAsync({
    //   useFactory: () => ({
    //     secret: process.env.JWT_SECRET,
    //     signOptions: { expiresIn: '3600s'}
    //   })
    // })
  ],
  providers: [AuthService, LocalStrategy, SessionSerializer, UserService], //JwtStrategy
  controllers: [AuthController, UserController],
  exports: [AuthService, UserService]
})
export class AuthModule {}
