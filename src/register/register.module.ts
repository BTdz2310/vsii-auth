import { Module } from '@nestjs/common';
import { RegisterService } from './register.service';
import { RegisterController } from './register.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { KeyTokenService } from 'src/commons/key-token/key-token.service';
import { BcryptService } from 'src/commons/bcrypt/bcrypt.service';
import { JwtService } from '@nestjs/jwt';
import { KafkaModule } from 'src/kafka/kafka.module';

@Module({
  imports: [KafkaModule],
  controllers: [RegisterController],
  providers: [
    RegisterService,
    PrismaService,
    KeyTokenService,
    BcryptService,
    JwtService,
  ],
})
export class RegisterModule {}
