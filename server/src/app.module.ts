import {Module} from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import * as path from 'path';
import {ServeStaticModule} from '@nestjs/serve-static';
import {MongooseModule} from '@nestjs/mongoose';
import {UsersModule} from './users/users.module';
import {AuthModule} from './auth/auth.module';
import {AppExceptionFilter} from './filter/app-exception.filter';
import {APP_FILTER} from '@nestjs/core';
import {MailerModule} from "@nestjs-modules/mailer";
import {EjsAdapter} from "@nestjs-modules/mailer/dist/adapters/ejs.adapter";
import * as Joi from 'joi';

@Module({
  imports: [
    ServeStaticModule.forRoot({rootPath: path.resolve(__dirname, 'static')}),
    ConfigModule.forRoot({
      envFilePath: `.env`, isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
            .valid('development', 'production', 'test', 'provision')
            .default('development'),
        PORT: Joi.number().default(5000),
        MONGO_URI: Joi.string().required(),
        JWT_ACCESS_SECRET: Joi.string().required(),
        JWT_REFRESH_SECRET: Joi.string().required(),
        SMTP_HOST: Joi.string(),
        SMTP_PORT: Joi.number(),
        SMTP_USER: Joi.string(),
        SMTP_PASS: Joi.string(),
        MAIL_PREVIEW_BROWSER: Joi.boolean().default(false),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },

    }),

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

    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get<string>('SMTP_HOST'),
          port: config.get<number>('SMTP_PORT'),
          ignoreTLS: true,
          secure: false,
          auth: {
            user: config.get<string>('SMTP_USER'),
            pass: config.get<string>('SMTP_PASS'),
          },
        },
        defaults: {
          from: '"No Reply" <no-reply@localhost>',
        },
        preview: config.get<boolean>('MAIL_PREVIEW_BROWSER'),
        template: {
          dir: __dirname + '/emails',
          adapter: new EjsAdapter(),
          options: {
            strict: true,
          },
        },
      })
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
