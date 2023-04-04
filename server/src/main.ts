import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import * as cookieParser from 'cookie-parser';
import {ConfigService} from "@nestjs/config";
import {useContainer} from "class-validator";

const start = async () => {
    try {
        const app = await NestFactory.create(AppModule);

        useContainer(app.select(AppModule), {fallbackOnErrors: true});

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
