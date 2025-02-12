import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'REGISTER_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'register',
            brokers: [
              `${process.env.NODE_ENV === 'dev' ? 'localhost' : 'kafka'}:9092`,
              // 'localhost:9092',
            ],
            retry: {
              retries: 1,
              multiplier: 1,
            },
          },
          consumer: {
            groupId: 'register-consumer',
          },
          producer: {
            allowAutoTopicCreation: true,
          },
        },
      },
      {
        name: 'LOGIN_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'login',
            brokers: [
              `${process.env.NODE_ENV === 'dev' ? 'localhost' : 'kafka'}:9092`,
              // 'localhost:9092',
            ],
            retry: {
              retries: 1,
              multiplier: 1,
            },
          },
          consumer: {
            groupId: 'login-consumer',
          },
          producer: {
            allowAutoTopicCreation: true,
          },
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class KafkaModule {}
