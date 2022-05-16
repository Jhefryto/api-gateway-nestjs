import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserController } from './controllers/user.controller';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constans/constants';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
    ClientsModule.register([
      {
        name: 'COMMUNICATION',
        transport: Transport.TCP,
      },
      {
        name: 'ANALYTICS',
        transport: Transport.TCP,
        options: { port: 3001 },
      },
      {
        name: 'MICRO_AUTH',
        transport: Transport.TCP,
        options: { port: 3002 },
      },
      {
        name: 'MICRO_USER',
        transport: Transport.TCP,
        options: { port: 3003 },
      },
      {
        name: 'MICRO_DIGITAL',
        transport: Transport.TCP,
        options: { port: 3004 },
      },
      {
        name: 'MICRO_MAIL',
        transport: Transport.TCP,
        options: { port: 3005 },
      },
    ]),
  ],
  controllers: [UserController, AuthController],
  providers: [AuthService, UserService, JwtStrategy],
})
export class AppModule {}
