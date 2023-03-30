import {Body, Controller, Get, Param, Post, Req, Res, UseGuards} from '@nestjs/common';
import {Request, Response} from 'express';
import {AuthService} from './auth.service';
import {AuthDto} from './dto/auth.dto';
import {AccessTokenGuard} from '../guards/access-token.guard';
import {RefreshTokenGuard} from '../guards/refresh-token.guard';
import {Tokens} from "./interfaces.tokens";
import {MailerService} from "@nestjs-modules/mailer";
import {SignupDto} from "./dto/signup.dto";
import {UsersService} from "../users/users.service";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService, private userService: UsersService, private mailService: MailerService) {
    }

    /*

    @Post('test')
    test(@Req() req: Request) {
      console.log(req.cookies);
      return {
        ok: true
      }
    }

     */
    @Post('signup')
    async signup(@Res({passthrough: true}) response: Response, @Body() signupDto: SignupDto) {
        const tokens: Tokens = await this.authService.signUp(signupDto);
        //refresh token life 7d
        response.cookie('refreshToken', tokens.refreshToken, {maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true})
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


    @Post('signin')
    signin(@Body() data: AuthDto) {
        console.log(`AuthDto`, AuthDto);
        return this.authService.signIn(data);
    }

    @UseGuards(AccessTokenGuard)
    @Get('logout')
    logout(@Req() req: Request, res: Response) {
        const {refreshToken} = req.cookies;
        this.authService.logout(req.user['userId']);
        //res.clearCookie('refreshToken');
    }


    @UseGuards(RefreshTokenGuard)
    @Get('refreshToken')
    refreshTokens(@Req() req: Request) {
        const userId = req.user['sub'];
        const refreshToken = req.user['refreshToken'];
        return this.authService.refreshTokens(userId, refreshToken);
    }
}
