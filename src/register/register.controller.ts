import { Controller, Post, Body, Get, Inject } from '@nestjs/common';
import { RegisterService } from './register.service';
import { CreateRegisterDto } from './dto/create-register.dto';
import { ClientKafka, EventPattern, Payload } from '@nestjs/microservices';
import { UserPayloadRollbackRegisterDto } from './dto/consumer.dto';
import { KeyTokenService } from 'src/commons/key-token/key-token.service';

@Controller('register')
export class RegisterController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly kafkaClient: ClientKafka,
    private readonly registerService: RegisterService,
    private readonly keyService: KeyTokenService,
  ) {}

  onModuleInit() {
    this.kafkaClient.subscribeToResponseOf('auth.check');
    // this.kafkaClient.connect();
  }

  @Get()
  findAll() {
    return `Hello world FIND ALL ${process.env.DATABASE_URL} ${process.env.NODE_ENV}`;
  }

  @Post()
  create(@Body() createRegisterDto: CreateRegisterDto) {
    return this.registerService.register(createRegisterDto);
  }

  @EventPattern('user.register-failed')
  rollBackRegister(@Payload() data: UserPayloadRollbackRegisterDto) {
    console.log(data);
    return this.registerService.rollBackRegister(data);
  }

  @Get('check')
  async getCheck() {
    // return "HELLO"
    return await this.kafkaClient.send('auth.check', 'VN!!!').toPromise();
    // return this.registerService.getCheck();
  }

  // @Post('check')
  // check(@Body() data: { username: string; token: string }) {
  //   return this.registerService.check(data);
  // }
}
