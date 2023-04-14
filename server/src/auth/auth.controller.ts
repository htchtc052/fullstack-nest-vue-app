import {Body, Controller, Post, Req, UseGuards} from '@nestjs/common';
import {Request} from 'express';
import {SignInDto} from './dto/signIn.dto';
import {RefreshTokenGuard} from '../guards/refresh-token.guard';
import {SignUpDto} from "./dto/signUp.dto";
import {UserService} from "../user/user.service";
import {ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiUnauthorizedResponse} from "@nestjs/swagger";
import {AuthRO} from "./types/authRO";
import {AuthService} from "./auth.service";
import {User} from "../user/schemas/user.schema";
import {TokensDto} from "./dto/tokens.dto";
import {plainToClass} from "class-transformer";
import {UserDto} from "../user/dto/userDto";


@Controller('auth')
export class AuthController {
    constructor(private usersService: UserService, private authService: AuthService) {
    }

    @ApiOperation({summary: 'Create user'})
    @ApiOkResponse({type: AuthRO})
    @ApiBadRequestResponse()
    @Post('signup')
    async signUp(@Body() signupDto: SignUpDto): Promise<AuthRO> {
        const {user, tokens} = await this.authService.signUp(signupDto)
        return this.generateAuthRO(user, tokens)
    }

    @ApiOperation({summary: 'Signin User'})
    @ApiOkResponse({type: AuthRO})
    @ApiBadRequestResponse()
    @Post('signin')
    async signIn(@Body() signinDto: SignInDto): Promise<AuthRO> {
        const {user, tokens} = await this.authService.signIn(signinDto)
        return this.generateAuthRO(user, tokens)
    }


    @ApiOperation({summary: 'User logout'})
    @ApiOkResponse({type: String})
    @UseGuards(RefreshTokenGuard)
    @Post('logout')
    async logout(@Req() req: Request) {
        const refreshToken = req.user['refreshToken']
        await this.authService.logout(refreshToken);
        return 'User logout success'
    }


    @ApiOperation({summary: 'Refresh token'})
    @ApiOkResponse({type: AuthRO})
    @ApiUnauthorizedResponse()
    @UseGuards(RefreshTokenGuard)
    @Post('refreshToken')
    async refreshTokens(@Req() req: Request): Promise<AuthRO> {
        const refreshToken = req.user['refreshToken'];
        const {user, tokens} = await this.authService.refreshTokens(refreshToken)
        return this.generateAuthRO(user, tokens)
    }


    private generateAuthRO(user: User, tokens: TokensDto): AuthRO {
        return {user: plainToClass(UserDto, user, {excludeExtraneousValues: true}), tokens};
    }
}
