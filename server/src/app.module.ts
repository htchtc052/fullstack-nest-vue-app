import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import * as path from 'path';
import {ServeStaticModule} from '@nestjs/serve-static';
import * as Joi from 'joi';
import {UserModule} from "./user/user.module";
import {AuthModule} from "./auth/auth.module";
import {DatabaseModule} from "./database.module";
import {LangModule} from "./lang.module";

@Module({
    imports: [
        ServeStaticModule.forRoot({rootPath: path.resolve(__dirname, 'static')}),
        ConfigModule.forRoot({
            envFilePath: `.env`, isGlobal: true,
            validationSchema: Joi.object({
                NODE_ENV: Joi.string()
                    .valid('development', 'production', 'test', 'provision')
                    .default('development'),
                //PORT: Joi.number().default(5000),
                FRONTEND_URL: Joi.string().required(),
                BACKEND_URL: Joi.string().required(),
                MONGO_URI: Joi.string().required(),
                JWT_ACCESS_SECRET: Joi.string().required(),
                JWT_REFRESH_SECRET: Joi.string().required(),
                JWT_ACCESS_LIFE: Joi.number().required(),
                JWT_REFRESH_LIFE: Joi.number().required(),
                SMTP_HOST: Joi.string(),
                SMTP_PORT: Joi.number(),
                SMTP_USER: Joi.string(),
                SMTP_PASS: Joi.string().allow(""),
                MAIL_PREVIEW_BROWSER: Joi.boolean().default(false),

            }),
            validationOptions: {
                allowUnknown: true,
                abortEarly: false,
            },

        }),
        LangModule,
        DatabaseModule,
        UserModule,
        AuthModule,
    ],
    controllers: [],
    providers: [
        //{
        //   provide: APP_FILTER,
        //     useClass: AppExceptionFilter,
        // },
    ],
})
export class AppModule {
}
