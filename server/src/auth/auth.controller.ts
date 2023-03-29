import {BadGatewayException, Body, Controller, Get, Post, Req, Res, UseGuards} from '@nestjs/common';
import {Request, Response} from 'express';
import {CreateUserDto} from 'src/users/dto/create-user.dto';
import {AuthService} from './auth.service';
import {AuthDto} from './dto/auth.dto';
import {AccessTokenGuard} from '../guards/access-token.guard';
import {RefreshTokenGuard} from '../guards/refresh-token.guard';
import {Tokens} from "./interfaces.tokens";
import {MailerService} from "@nestjs-modules/mailer";

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private mailService: MailerService) {
  }

  @Post('test')
  test(@Req() req: Request) {
    console.log(req.cookies);
    return {
      ok: true
    }
  }

  @Get('email-test')
  async plainTextEmail() {
    try {
      console.log('dirName', __dirname);
      const emailData = await this.mailService.sendMail({
        to: "test@test.ru",
        from: 'user@test.com',
        subject: 'Testing Nest Mailermodule with template',
        template: 'signUp',
        context: {  // Data to be sent to template engine.
          "code": 'cf1a3f828287',
          "username": 'john doe',
        },
      });
      if (emailData) return emailData;
    } catch (e) {
      console.error(e);
      throw new BadGatewayException('Email send failed');
    }
    return {sended: true};
  }

  @Post('signup')
  async signup(@Res({passthrough: true}) response: Response, @Body() createUserDto: CreateUserDto) {
    const tokens: Tokens = await this.authService.signUp(createUserDto);
    //refresh token life 7d
    response.cookie('refreshToken', tokens.refreshToken, {maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true})
    return tokens;
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
