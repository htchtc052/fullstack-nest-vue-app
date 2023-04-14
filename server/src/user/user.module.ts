import {Module} from '@nestjs/common';
import {UserService} from './user.service';
import {UserController} from './user.controller';
import {User, UserSchema} from './schemas/user.schema';
import {MongooseModule} from '@nestjs/mongoose';
import {IsEmailAllreadyExists} from "./validators/isEmailAllreadyExists";
import {UserRepository} from "./user.repository";
import {EmailService} from "../email/email.service";
import {EmailModule} from "../email/email.module";

@Module({
    imports: [
        MongooseModule.forFeature([{name: User.name, schema: UserSchema}]),
        EmailModule
    ],
    controllers: [UserController],
    providers: [UserService, UserRepository, EmailService, IsEmailAllreadyExists],
    exports: [UserService, UserRepository],
})
export class UserModule {
}
