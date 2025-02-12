import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService {
  saltRound = 10;

  async hashPassword(password: string) {
    const salt = await bcrypt.genSalt(this.saltRound);
    const hashedPassword = await bcrypt.hash(password, salt);
    return {
      salt,
      hashedPassword,
    };
  }

  compare(password: string, hashPassword: string) {
    return bcrypt.compare(password, hashPassword);
  }
}
