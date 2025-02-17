import { KeyTokenService } from 'src/commons/key-token/key-token.service';
import { BadRequestException, Body, ConflictException, Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { BcryptService } from 'src/commons/bcrypt/bcrypt.service';
import { CreateRegisterDto } from './dto/create-register.dto';
import { ClientKafka } from '@nestjs/microservices';
import { UserPayloadRollbackRegisterDto } from './dto/consumer.dto';

@Injectable()
export class RegisterService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly kafkaClient: ClientKafka,
    private prisma: PrismaService,
    private bcryptService: BcryptService,
  ) {}

  async register(
    @Body()
    data: CreateRegisterDto,
  ) {
    try {
      const { hashedPassword } = await this.bcryptService.hashPassword(
        data.password,
      );

      const auth = await this.prisma.auth.create({
        data: {
          username: data.username,
          password: {
            create: {
              hash: hashedPassword,
            },
          },
        },
      });

      this.kafkaClient.emit('auth.register', {
        authId: auth.id,
        fullname: data.fullname,
        tags: data.tags,
      });

      return auth;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new ConflictException(
            'Username đã tồn tại. Vui lòng chọn username khác!!!',
          );
        }
      }
      throw e;
    }
  }

  async rollBackRegister(data: UserPayloadRollbackRegisterDto) {
    try {
      await this.prisma.auth.delete({
        where: {
          id: data.authId,
        },
      });
    } catch {}
  }

  // async check(data: { username: string; token: string }) {
  //   const auth = await this.prisma.auth.findFirst({
  //     where: {
  //       username: data.username,
  //     },
  //   });
  //   try {
  //     const user = this.keyTokenService.verifyToken(data.token);
  //     return user;
  //   } catch {
  //     throw new BadRequestException('Error');
  //   }
  // }

  getCheck() {
    console.log('WTF___>>>');
    return this.kafkaClient.send('auth.check', 'VN!!!');
  }
}
