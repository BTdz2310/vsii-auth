import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { BcryptService } from 'src/commons/bcrypt/bcrypt.service';
import { LocalStrategy } from 'src/strategies/local.trategy';
import { KeyTokenService } from 'src/commons/key-token/key-token.service';
import { JwtService } from '@nestjs/jwt';
import { KafkaModule } from 'src/kafka/kafka.module';

@Module({
  imports: [KafkaModule],
  controllers: [LoginController],
  providers: [
    LoginService,
    PrismaService,
    BcryptService,
    LocalStrategy,
    KeyTokenService,
    JwtService,
  ],
})
export class LoginModule {}
