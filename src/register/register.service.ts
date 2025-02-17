import { KeyTokenService } from 'src/commons/key-token/key-token.service';
import { BadRequestException, Body, Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { BcryptService } from 'src/commons/bcrypt/bcrypt.service';
import { CreateRegisterDto } from './dto/create-register.dto';
import { ClientKafka } from '@nestjs/microservices';
import { UserPayloadRollbackRegisterDto } from './dto/consumer.dto';

@Injectable()
export class RegisterService {
  constructor(
    @Inject('REGISTER_SERVICE') private readonly kafkaClient: ClientKafka,
    private prisma: PrismaService,
    private keyTokenService: KeyTokenService,
    private bcryptService: BcryptService,
  ) {}

  async register(
    @Body()
    data: CreateRegisterDto,
  ) {
    console.log(data);
    const { hashedPassword } = await this.bcryptService.hashPassword(
      data.password,
    );

    const auth = await this.prisma.auth.create({
      data: {
        ...data,
        password: {
          create: {
            hash: hashedPassword,
          },
        },
      },
    });

    this.kafkaClient.emit('auth.register', {
      authId: auth.id,
      fullName: data.fullname,
      tags: data.tags,
    });
    return auth;
  }

  // async rollBackRegister(data: UserPayloadRollbackRegisterDto) {
  //   try {
  //     console.log(data);
  //     await this.prisma.privateKey.delete({
  //       where: {
  //         userId: data.authId,
  //       },
  //     });
  //     await this.prisma.auth.delete({
  //       where: {
  //         id: data.authId,
  //       },
  //     });
  //   } catch {}
  // }

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

  // getCheck() {
  //   console.log('WTF___>>>')
  //   return this.kafkaClient.send('auth.check', 'VN!!!');
  // }
}
