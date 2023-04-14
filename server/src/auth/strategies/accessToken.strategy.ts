import {Injectable} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {ExtractJwt, Strategy} from 'passport-jwt';
import {AuthService} from "../auth.service";
import {User} from "../../user/schemas/user.schema";
import {JwtPayload} from "../types/JwtPayload";


@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_ACCESS_SECRET,
            ignoreExpiration: false,
            passReqToCallback: false,
        });
    }

    validate(payload: JwtPayload): Promise<User> {
        return this.authService.verifyPayload(payload);
    }
}
