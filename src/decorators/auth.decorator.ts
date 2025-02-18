import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthResponse } from 'interfaces/AuthResponse.interface';

export const Auth = createParamDecorator(
  (data: keyof AuthResponse | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    // console.log('request', request);
    const auth = request.user as AuthResponse;
    return auth;
  },
);
