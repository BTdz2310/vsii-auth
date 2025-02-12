import { Module } from '@nestjs/common';
import { RegisterModule } from './register/register.module';
import { RegisterController } from './register/register.controller';
import { RegisterService } from './register/register.service';
import { PrismaService } from './prisma/prisma.service';
import { KeyTokenService } from './commons/key-token/key-token.service';
import { KeyTokenModule } from './commons/key-token/key-token.module';
import { BcryptService } from './commons/bcrypt/bcrypt.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { KafkaModule } from './kafka/kafka.module';
import { LoginModule } from './login/login.module';
// console.log(join(__dirname, '..', '.env.dev'))

@Module({
  imports: [
    RegisterModule,
    KeyTokenModule,
    PassportModule,
    JwtModule.register({
      signOptions: {
        algorithm: 'RS256',
      },
    }),
    KafkaModule,
    LoginModule,
  ],
  controllers: [RegisterController],
  providers: [
    RegisterService,
    PrismaService,
    KeyTokenService,
    BcryptService,
    JwtService,
  ],
})
export class AppModule {}
