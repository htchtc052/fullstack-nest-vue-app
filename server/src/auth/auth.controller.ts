import {Body, Controller, Get, Param, Post, Req, Res, UseGuards} from '@nestjs/common';
import {Request, Response} from 'express';
import {AuthService} from './auth.service';
import {SigninDto} from './dto/signin.dto';
import {RefreshTokenGuard} from '../guards/refresh-token.guard';
import {Tokens} from "./interfaces.tokens";
import {MailerService} from "@nestjs-modules/mailer";
import {SignupDto} from "./dto/signup.dto";
import {UsersService} from "../users/users.service";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService, private userService: UsersService, private mailService: MailerService) {
    }

    //@UsePipes(new JoiValidationPipe(SignupValidationSchema))

    @Post('signup')
    async signup(@Res({passthrough: true}) response: Response, @Body() signupDto: SignupDto) {
        const tokens: Tokens = await this.authService.signup(signupDto);
        //refresh token life 7d
        //response.cookie('refreshToken', tokens.refreshToken, {maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true})
        return tokens;
    }


    @Post('signin')
    async signin(@Res({passthrough: true}) response: Response, @Body() signinDto: SigninDto) {
        const tokens = await this.authService.signin(signinDto);
        //refresh token life 7d
        //response.cookie('refreshToken', tokens.refreshToken, {maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true})
        return tokens;
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
        const tokenData = await this.authService.refreshTokens(refreshToken);
        return tokenData;
    }
}
