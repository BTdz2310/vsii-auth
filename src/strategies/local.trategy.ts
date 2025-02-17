import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { IStrategyOptions, Strategy } from 'passport-local';

import { LoginService } from '../login/login.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly authService: LoginService) {
    super({ usernameField: 'username' } as IStrategyOptions);
  }

  async validate(username: string, password: string) {
    try {
      console.log('data2', username, password);
      return await this.authService.authenticate({ username, password });
    } catch {
      throw new BadRequestException('Invalid credentials');
    }
  }
}
