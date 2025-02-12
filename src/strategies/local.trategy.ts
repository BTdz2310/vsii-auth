import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { IStrategyOptions, Strategy } from 'passport-local';

import { LoginService } from '../login/login.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly authService: LoginService) {
    super({ usernameField: 'identifier' } as IStrategyOptions);
  }

  async validate(identifier: string, password: string) {
    try {
      return await this.authService.authenticate({ identifier, password });
    } catch {
      throw new BadRequestException('Invalid credentials');
    }
  }
}
