import {Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import {ConfigModule, ConfigService} from "@nestjs/config";

@Module({
    imports: [
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
        })
    ],
})
export class DatabaseModule {

}