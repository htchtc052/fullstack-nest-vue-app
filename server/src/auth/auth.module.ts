import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {AuthController} from './auth.controller';
import {JwtModule} from '@nestjs/jwt';
import {AccessTokenStrategy} from '../strategies/accessToken.strategy';
import {RefreshTokenStrategy} from '../strategies/refreshToken.strategy';
import {UsersModule} from '../users/users.module';
import {EmailModule} from "../email/email.module";
import {EmailService} from "../email/email.service";

@Module({
    imports: [JwtModule.register({}), UsersModule, EmailModule],
    controllers: [AuthController],
    providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy, EmailService],
})
export class AuthModule {
}
