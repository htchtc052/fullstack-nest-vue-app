import {UserService} from "../user/user.service";
import {BadRequestException, Injectable, UnauthorizedException} from "@nestjs/common";
import {TokensService} from "./tokens.service";
import {EmailService} from "../email/email.service";
import {SignUpDto} from "./dto/signUp.dto";
import {SignInDto} from "./dto/signIn.dto";
import * as argon2 from "argon2";

@Injectable()
export class AuthService {
    constructor(
        private usersService: UserService,
        private tokensService: TokensService,
        private emailService: EmailService,
    ) {
    }

    async signUp(signupDto: SignUpDto): Promise<{ user, tokens }> {


        const user = await this.usersService.createUser(signupDto, {createActivated: false})

        await this.emailService.sendActivationEmail(user);

        const tokens = await this.tokensService.generateAndSaveTokens(user);
        return {user, tokens}
    }

    async signIn(signinDto: SignInDto): Promise<{ user, tokens }> {
        const user = await this.usersService.findByEmail(signinDto.email);

        if (!user) throw new BadRequestException('User does not exist');

        const passwordMatches = await argon2.verify(user.password, signinDto.password);
        if (!passwordMatches)
            throw new BadRequestException('Password is incorrect');

        const tokens = await this.tokensService.generateAndSaveTokens(user);
        return {user, tokens}
    }

    async logout(refreshToken: string): Promise<void> {
        await this.tokensService.removeToken(refreshToken);
    }

    async refreshTokens(refreshToken: string): Promise<{ user, tokens }> {
        const user = await this.tokensService.getUserByRefreshToken(refreshToken)
        if (!user) {
            throw  new UnauthorizedException('User not found by refresh token')
        }
        const tokens = await this.tokensService.generateAndSaveTokens(user);
        return {user, tokens}
    }
}