import { Controller, Get, Inject, Post, Res, UseGuards } from '@nestjs/common';
import { LoginService } from './login.service';
import { LocalGuard } from 'src/guards/local.guard';
import { AuthResponse } from 'interfaces/AuthResponse.interface';
import { Auth } from 'src/decorators/auth.decorator';
import type { Response } from 'express';
import { KeyTokenService } from 'src/commons/key-token/key-token.service';
import { ClientKafka } from '@nestjs/microservices';

@Controller('login')
export class LoginController {
  constructor(
    @Inject('LOGIN_SERVICE') private readonly kafkaClient: ClientKafka,
    private readonly loginService: LoginService,
    private readonly keyTokenService: KeyTokenService,
  ) {}

  onModuleInit() {
    this.kafkaClient.subscribeToResponseOf('auth.getUser');
    this.kafkaClient.subscribeToResponseOf('auth.check2');
    this.kafkaClient.connect();
  }

  private async handleAuthenticationResponse(
    auth: AuthResponse,
    response: Response,
  ) {
    // console.log(auth)
    const user = await this.kafkaClient
      .send('auth.getUser', {
        authId: auth.id,
      })
      .toPromise();
    const { fullName, avatar } = user;
    const { accessToken, refreshToken } = this.keyTokenService.signToken({
      ...auth,
      fullName,
      avatar,
    });
    // console.log('user', user);
    // response.cookie('Access_Token', accessToken, {
    //   httpOnly: false,
    //   sameSite: 'lax',
    //   secure: false,
    //   expires: new Date(Date.now() + 15 * 60 * 1000),
    // });
    response.cookie('Refresh-Token', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    });
    const resp = {
      user,
      accessToken,
    };
    response.status(200).send(resp);
  }

  @Post('')
  @UseGuards(LocalGuard)
  async login(
    @Auth() auth: AuthResponse,
    @Res({ passthrough: true }) response: Response,
  ) {
    // console.log('auth', auth);
    return this.handleAuthenticationResponse(auth, response);
  }

  @Get('check')
  async getCheck() {
    // return "HELLO"
    return await this.kafkaClient.send('auth.check2', 'VN!!!').toPromise();
    // return this.registerService.getCheck();
  }
}
