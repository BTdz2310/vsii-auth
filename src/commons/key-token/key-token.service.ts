import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as fs from 'fs';
import { join } from 'path';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class KeyTokenService {
  constructor(
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  accessTokenDuration = '1d';
  refreshTokenDuration = '1y';
  // jwtHeader = {
  //   algorithm: 'RS256',
  //   header: { typ: 'JWT' },
  // };

  getPrivateKey(): string {
    const key = process.env.PRIVATE_KEY;
    const keyPath = join(process.cwd(), 'keys', key);
    return fs.readFileSync(keyPath, 'utf8');
  }

  // Token
  signToken(payload: any) {
    const privateKey = this.getPrivateKey();
    const accessToken = this.jwt.sign(payload, {
      expiresIn: this.accessTokenDuration,
      secret: privateKey,
      header: {
        typ: 'JWT',
        alg: 'RS256',
      },
    });
    const refreshToken = this.jwt.sign(payload, {
      expiresIn: this.refreshTokenDuration,
      secret: privateKey,
      header: {
        typ: 'JWT',
        alg: 'RS256',
      },
    });
    return {
      accessToken,
      refreshToken,
    };
  }

  // verifyAccessToken(token: string) {
  //   const accessKey = this.getAccessKey();
  //   return this.jwt.verify(token, {
  //     publicKey: accessKey,
  //   });
  // }

  // verifyRefreshToken(token: string) {
  //   const refreshKey = this.getRefreshKey();
  //   return this.jwt.verify(token, {
  //     publicKey: refreshKey,
  //   });
  // }

  // async exchangeToken(auth: AuthResponse) {
  //   const { privateKey, publicKey } = this.generateKeyPair();
  //   const { accessToken, refreshToken } = this.signToken(auth, privateKey);
  //   await this.prisma.auth.update({
  //     data: {
  //       publicKey,
  //       privateKey: {
  //         upsert: {
  //           create: {
  //             secretKey: privateKey,
  //           },
  //           update: {
  //             secretKey: privateKey,
  //           },
  //         },
  //       },
  //     },
  //     where: {
  //       id: auth.id,
  //     },
  //   });
  //   return {
  //     accessToken,
  //     refreshToken,
  //   };
  // }
}
