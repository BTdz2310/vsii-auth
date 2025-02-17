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
    const { username, password } = data;
    const auth = await this.prisma.auth.findFirstOrThrow({
      where: {
        username,
      },
      select: {
        id: true,
        username: true,
        password: true,
        role: true,
      },
    });
    const isMatch = await this.bcrypt.compare(password, auth.password.hash);
    if (!isMatch) throw new InternalServerErrorException('');
    return {
      id: auth.id,
      username: auth.username,
      role: auth.role,
    };
  }
}
