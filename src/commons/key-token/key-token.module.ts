import { Module } from '@nestjs/common';
import { KeyTokenService } from './key-token.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [KeyTokenService, JwtService, PrismaService],
})
export class KeyTokenModule {}
