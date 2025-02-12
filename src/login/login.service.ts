import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BcryptService } from 'src/commons/bcrypt/bcrypt.service';
import { CreateLoginDto } from './dto/create-login.dto';

@Injectable()
export class LoginService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly bcrypt: BcryptService,
  ) {}

  async authenticate(data: CreateLoginDto) {
    const { identifier, password } = data;
    const auth = await this.prisma.auth.findFirstOrThrow({
      where: {
        username: identifier,
      },
      select: {
        id: true,
        username: true,
        password: true,
      },
    });
    const isMatch = await this.bcrypt.compare(password, auth.password);
    if (!isMatch) throw new InternalServerErrorException('');
    return {
      id: auth.id,
      username: auth.username,
    };
  }
}
