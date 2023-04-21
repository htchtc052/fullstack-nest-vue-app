import {Module} from '@nestjs/common';
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

@Module({

    imports: [
        MongooseModule.forFeature([{name: User.name, schema: UserSchema}]),
        EmailModule,
        JwtModule.register({}),
    ],
    controllers: [UserController, UserProfileController, AdminController],
    providers: [UserService, UserRepository, EmailService, IsEmailAllreadyExists, JwtService],
    exports: [UserService, UserRepository],
})
export class UserModule {
}
