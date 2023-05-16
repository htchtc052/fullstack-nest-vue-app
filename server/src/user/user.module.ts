import {MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import {UserService} from './user.service';
import {UserController} from './user.controller';
import {User, UserSchema} from './schemas/user.schema';
import {MongooseModule} from '@nestjs/mongoose';
import {IsEmailAllreadyExists} from "./validators/isEmailAllreadyExists";
import {UserRepository} from "./user.repository";
import {EmailService} from "../email/email.service";
import {EmailModule} from "../email/email.module";
import {JwtModule, JwtService} from "@nestjs/jwt";
import {UserProfileController} from "./userProfile.controller";
import {AdminController} from "./admin.controller";
import {AbilityModule} from "../ability/ability.module";
import {GetUserProfileMiddleware} from "./middleware/getUserProfile";
import {ReadUserPolicyProvider} from "../ability/providers/user/read-user.policy.provider";

@Module({

    imports: [
        MongooseModule.forFeature([{name: User.name, schema: UserSchema}]),
        EmailModule,
        JwtModule.register({}),
        AbilityModule
    ],
    controllers: [UserController, UserProfileController, AdminController],
    providers: [UserService, UserRepository, EmailService, IsEmailAllreadyExists, JwtService, ReadUserPolicyProvider],
    exports: [UserService, UserRepository],
})

export class UserModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(GetUserProfileMiddleware)
            .forRoutes(
                {path: 'user-profile/:slug', method: RequestMethod.GET},
                {path: 'user-profile/:slug', method: RequestMethod.PUT},
            )
    }
}
