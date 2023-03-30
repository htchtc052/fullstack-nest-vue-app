import {BadRequestException, Injectable,} from '@nestjs/common';
import {UsersService} from '../users/users.service';
import {JwtService} from '@nestjs/jwt';
import {ConfigService} from '@nestjs/config';
import {AuthDto} from './dto/auth.dto';
import * as argon2 from 'argon2';
import {JwtTokenDto} from "./dto/jwtToken.dto";
import {TokenService} from "../users/token.service";
import {Tokens} from "./interfaces.tokens";
import {v4 as uuid} from 'uuid';
import {EmailService} from "../email/email.service";
import {SignupDto} from "./dto/signup.dto";

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
        private tokenService: TokenService,
        private emailService: EmailService
    ) {
    }

    async signUp(signupDto: SignupDto): Promise<Tokens> {

        const userExists = await this.usersService.findByUsername(
            signupDto.username,
        );

        if (userExists) {
            throw new BadRequestException('User already exists');
        }

        const hash = await argon2.hash(signupDto.password);

        const activationToken: string = uuid();

        const user = await this.usersService.create({
            ...signupDto,
            password: hash,
            activationToken
        });

        try {
            await this.emailService.sendActivationEmail(user, activationToken);
        } catch (e) {
            console.error(e)
        }
        const tokens = await this.generateTokens({userId: user._id, username: user.username, email: user.email});
        await this.tokenService.saveRefreshToken(user._id, tokens.refreshToken);


        return tokens;
    }


    async signIn(data: AuthDto) {
        // Check if user exists
        const user = await this.usersService.findByUsername(data.username);
        if (!user) throw new BadRequestException('User does not exist');
        const passwordMatches = await argon2.verify(user.password, data.password);
        if (!passwordMatches)
            throw new BadRequestException('Password is incorrect');

        const tokens = await this.generateTokens({userId: user._id, username: user.username, email: user.email});
        await this.tokenService.saveRefreshToken(user._id, tokens.refreshToken);

        return tokens;
    }

    async logout(refreshToken) {
        const token = await this.tokenService.removeToken(refreshToken);
        return token;
    }

    async generateTokens(payload: JwtTokenDto) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload,
                {
                    secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
                    expiresIn: '2m',
                },
            ),
            this.jwtService.signAsync(
                payload,
                {
                    secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
                    //refresh token life 7d
                    expiresIn: '7d',
                },
            ),
        ]);

        return {
            accessToken,
            refreshToken,
        };
    }

    async refreshTokens(userId: string, refreshToken: string) {

        const tokens = [];
        /*

            const userData = tokenService.validateRefreshToken(refreshToken);
            const tokenFromDb = await tokenService.findToken(refreshToken);
            if (!userData || !tokenFromDb) {
              throw ApiError.UnauthorizedError();
            }
            const user = await UserModel.findById(userData.id);
            const userDto = new UserDto(user);
            const tokens = tokenService.generateTokens({...userDto});

            await tokenService.saveToken(userDto.id, tokens.refreshToken);
            return {...tokens, user: userDto}


            const user = await this.usersService.findById(userId);
            if (!user || !user.refreshToken)
              throw new ForbiddenException('Access Denied');
            const refreshTokenMatches = await argon2.verify(
              user.refreshToken,
              refreshToken,
            );
            if (!refreshTokenMatches) {
              throw new ForbiddenException('Access Denied');
            }
            const tokens = await this.generateTokens( {userId: user._id, username: user.username, email: user.email});
            await this.tokenService.saveRefreshToken(user._id, tokens.refreshToken);
         */
        return tokens;
    }


}
