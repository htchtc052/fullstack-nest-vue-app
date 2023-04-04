import {Body, Controller, Get, Param, Post, Req, Res, UseGuards, UsePipes} from '@nestjs/common';
import {Request, Response} from 'express';
import {AuthService} from './auth.service';
import {SigninDto} from './dto/signin.dto';
import {RefreshTokenGuard} from '../guards/refresh-token.guard';
import {MailerService} from "@nestjs-modules/mailer";
import {SignupDto} from "./dto/signup.dto";
import {UsersService} from "../users/users.service";
import {AuthUserEntity} from "../users/entities/authUser.entity";
import {plainToClass} from "class-transformer";
import {ValidationPipe} from "../pipes/validation.pipe";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService, private userService: UsersService, private mailService: MailerService) {
    }

    //@UsePipes(new JoiValidationPipe(SignupValidationSchema))


    @UsePipes(new ValidationPipe())
    @Post('signup')
    async signup(@Res({passthrough: true}) response: Response, @Body() signupDto: SignupDto) {
        const tokens = await this.authService.signup(signupDto);

        return tokens;
    }


    @Post('signin')
    async signin(@Res({passthrough: true}) response: Response, @Body() signinDto: SigninDto) {
        const user = await this.authService.signin(signinDto);

        const authUser: AuthUserEntity = plainToClass(AuthUserEntity, user, {excludeExtraneousValues: true});

        const tokens = await this.authService.generateAndSaveTokens(user);

        console.log(`authUser`, authUser);
        return {...tokens, authUser};
    }

    @Get('activate/:activationToken')
    async activate(@Param('activationToken') activationToken: string) {
        console.log(`activationToken=${activationToken}`);
        if (await this.userService.activate(activationToken))
            return {msg: 'User activated'}
        else
            return {error: 'Activation link wrong'}
    }


    @UseGuards(RefreshTokenGuard)
    @Post('logout')
    async logout(@Req() req: Request, res: Response) {
        const refreshToken = req.user['refreshToken']
        await this.authService.logout(refreshToken);
        return {refreshToken}
    }

    @UseGuards(RefreshTokenGuard)
    @Post('refreshToken')
    async refreshTokens(@Req() req: Request) {
        const refreshToken = req.user['refreshToken'];
        const tokens = await this.authService.refreshTokens(refreshToken);
        return tokens;
    }
}
