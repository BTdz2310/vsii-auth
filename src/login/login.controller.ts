import { Controller, Get, Inject, Post, Res, UseGuards } from '@nestjs/common';
import { LoginService } from './login.service';
import { LocalGuard } from 'src/guards/local.guard';
import { AuthResponse } from 'src/interfaces/AuthResponse.interface';
import { Auth } from 'src/decorators/auth.decorator';
import type { Response } from 'express';
import { KeyTokenService } from 'src/commons/key-token/key-token.service';
import { ClientKafka } from '@nestjs/microservices';

@Controller('login')
export class LoginController {
  constructor(
    @Inject('REGISTER_SERVICE') private readonly kafkaClient: ClientKafka,
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
    // const { accessToken, refreshToken } =
    //   await this.keyTokenService.exchangeToken(auth);
    // console.log('accessToken', accessToken);
    // console.log('refreshToken', refreshToken);
    // const user = await this.kafkaClient
    //   .send('auth.getUser', {
    //     authId: auth.id,
    //     username: auth.username,
    //   })
    //   .toPromise();
    // console.log('user', user);
    // response.cookie('Access_Token', accessToken, {
    //   httpOnly: true,
    //   sameSite: 'lax',
    //   secure: false,
    //   expires: new Date(Date.now() + 15 * 60 * 1000),
    // });
    // response.cookie('Refresh_Token', refreshToken, {
    //   httpOnly: true,
    //   sameSite: 'lax',
    //   secure: false,
    //   expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    // });
    // response.status(200).send(user);
  }

  @Post('')
  @UseGuards(LocalGuard)
  async login(
    @Auth() auth: AuthResponse,
    @Res({ passthrough: true }) response: Response,
  ) {
    console.log('auth', auth);
    return this.handleAuthenticationResponse(auth, response);
  }

  @Get('check')
  async getCheck() {
    // return "HELLO"
    return await this.kafkaClient.send('auth.check2', 'VN!!!').toPromise();
    // return this.registerService.getCheck();
  }
}
