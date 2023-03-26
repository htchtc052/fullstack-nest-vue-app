import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as path from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AppExceptionFilter } from './filter/app-exception.filter';
import { APP_FILTER } from '@nestjs/core';

@Module({
  imports: [
    ServeStaticModule.forRoot({ rootPath: path.resolve(__dirname, 'static') }),
    ConfigModule.forRoot({ envFilePath: `.env`, isGlobal: true }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        return {
          connectionFactory: async (connection) => {
            if (connection.readyState === 1) {
              console.log('DB connected');
            }

            connection.on('disconnected', () => {
              console.log('DB disconnected');
            });

            return connection;
          },
          uri: config.get<string>('MONGO_URI'),
        };
      },
    }),

    UsersModule,

    AuthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AppExceptionFilter,
    },
  ],
})
export class AppModule {}
