import {BadRequestException, Injectable, UnauthorizedException,} from '@nestjs/common';
import {UsersService} from '../users/users.service';
import {JwtService} from '@nestjs/jwt';
import {ConfigService} from '@nestjs/config';
import {SigninDto} from './dto/signin.dto';
import * as argon2 from 'argon2';
import {TokenService} from "../users/token.service";
import {v4 as uuid} from 'uuid';
import {EmailService} from "../email/email.service";
import {SignupDto} from "./dto/signup.dto";
import {TokenDocument} from "../users/schemas/token.schema";
import {Tokens} from "./interfaces/tokens";
import {AuthUserEntity} from "../users/entities/authUser.entity";
import {plainToClass} from "class-transformer";
import {User} from "../users/schemas/user.schema";


@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
        private tokenService: TokenService,
        private emailService: EmailService,
    ) {
    }

    async signup(signupDto: SignupDto): Promise<Tokens> {

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


        const authUser: AuthUserEntity = plainToClass(AuthUserEntity, user, {excludeExtraneousValues: true});

        console.log(`authUser`, authUser);
        const tokens = await this.generateAndSaveTokens(authUser);

        return tokens
    }


    async signin(signinDto: SigninDto): Promise<User> {
        const user = await this.usersService.findByEmail(signinDto.email);

        if (!user) throw new BadRequestException('User does not exist');

        const passwordMatches = await argon2.verify(user.password, signinDto.password);
        if (!passwordMatches)
            throw new BadRequestException('Password is incorrect');

        return user;
    }


    async logout(refreshToken) {
        const token = await this.tokenService.removeToken(refreshToken);
        return token;
    }

    async generateTokens(payload: AuthUserEntity) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(JSON.parse(JSON.stringify(payload)),
                {
                    secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
                    expiresIn: this.configService.get<number>('JWT_ACCESS_LIFE'),
                },
            ),
            this.jwtService.signAsync(
                JSON.parse(JSON.stringify(payload)),
                {
                    secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
                    expiresIn: this.configService.get<number>('JWT_REFRESH_LIFE'),
                },
            ),
        ]);

        return {
            accessToken,
            refreshToken,
        };
    }

    async refreshTokens(refreshToken) {
        const tokenData: TokenDocument = await this.tokenService.getTokenData(refreshToken);
        if (!tokenData) {
            throw  new UnauthorizedException('Refresh token not found')
        }
        const user = await this.usersService.findById(tokenData?.user?._id);

        if (!user) {
            throw  new UnauthorizedException('User not found by refresh token')
        }

        const authUser: AuthUserEntity = plainToClass(AuthUserEntity, user, {excludeExtraneousValues: true});

        console.log(`authUser`, authUser);
        const tokens = await this.generateAndSaveTokens(authUser);

        return tokens;
        /*

            const userData = tokenService.validateRefreshToken(refreshToken);
            const tokenFromDb = await tokenService.getTokenData(refreshToken);
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
    }

    async generateAndSaveTokens(authUser: AuthUserEntity) {
        const tokens = await this.generateTokens(authUser);
        await this.tokenService.saveRefreshToken(authUser._id, tokens.refreshToken);
        return tokens;
    }


}
