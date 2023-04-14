import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {ConfigService} from "@nestjs/config";
import {useContainer} from "class-validator";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {I18nValidationExceptionFilter, I18nValidationPipe} from "nestjs-i18n";

const start = async () => {
    try {
        const app = await NestFactory.create(AppModule);
        const config = new DocumentBuilder()
            .setTitle('MyMusic App API')
            .setDescription('MyMusic App API with auth and upload tracks functionality')
            .setVersion('1.0')
            .build();


        const document = SwaggerModule.createDocument(app, config);

        SwaggerModule.setup('api-docs', app, document);

        useContainer(app.select(AppModule), {fallbackOnErrors: true});

        app.useGlobalPipes(
            new I18nValidationPipe(),
        );


        app.useGlobalFilters(new I18nValidationExceptionFilter({
            errorFormatter: (errors => {

                //console.debug(errors)
                const errorMessages = [];
                errors.forEach(error => {
                    const errorObj = {
                        [`${error.property}`]: Object.values(error.constraints)[0]
                    }

                    errorMessages.push(errorObj)
                });

                return errorMessages;

            })
        }))


        //app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

        const configService = app.get(ConfigService);
        const PORT = configService.get<number>("PORT");

        // app.enableCors()
        await app.listen(PORT, async () => {
            console.log(
                `server started on PORT ${PORT} MONGO_URI ${process.env.MONGO_URI} at url ` +
                (await app.getUrl()),
            );
        });
        //app.use(cookieParser());
    } catch (e) {
        console.log(e);
    }

};

start();
