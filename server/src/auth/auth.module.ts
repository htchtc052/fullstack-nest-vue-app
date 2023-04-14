import {Module} from '@nestjs/common';
import {AuthController} from './auth.controller';
import {UserModule} from '../user/user.module';
import {TokensService} from "./tokens.service";
import {UserService} from "../user/user.service";
import {MongooseModule} from "@nestjs/mongoose";
import {Token, TokenSchema} from "./schema/token.schema";
import {JwtModule} from "@nestjs/jwt";
import {AccessTokenStrategy} from "./strategies/accessToken.strategy";
import {RefreshTokenStrategy} from "./strategies/refreshToken.strategy";
import {TokensRepository} from "./tokens.repository";
import {EmailModule} from "../email/email.module";
import {EmailService} from "../email/email.service";
import {AuthService} from "./auth.service";

@Module({
    imports: [
        MongooseModule.forFeature([{name: Token.name, schema: TokenSchema}]),
        JwtModule.register({}),
        UserModule,
        EmailModule
    ],
    controllers: [AuthController],

    providers: [AuthService, TokensService, UserService, AccessTokenStrategy, RefreshTokenStrategy, TokensRepository, EmailService]
})
export class AuthModule {
}
