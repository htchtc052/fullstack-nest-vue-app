import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import * as cookieParser from 'cookie-parser';
import {ConfigService} from "@nestjs/config";
import {BadRequestException, ValidationPipe} from "@nestjs/common";

const start = async () => {
    try {
        const app = await NestFactory.create(AppModule);

        app.useGlobalPipes(new ValidationPipe({
            transform: true, exceptionFactory: (errors) => {
                const errorMessages = {errors: []};
                errors.forEach(error => {
                    errorMessages.errors.push({[`${error.property}`]: Object.values(error.constraints).join('. ').trim()});
                });
                return new BadRequestException(errorMessages);
            }
        }));
        const configService = app.get(ConfigService);
        const PORT = configService.get<number>("PORT");

        // app.enableCors()
        await app.listen(PORT, async () => {
            console.log(
                `server started on PORT ${PORT} MONGO_URI ${process.env.MONGO_URI} at url ` +
                (await app.getUrl()),
            );
        });

        app.use(cookieParser());
    } catch (e) {
        console.log(e);
    }

};

start();
