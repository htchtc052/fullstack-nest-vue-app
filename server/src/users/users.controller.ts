import {Body, Controller, Get, Post, Req, UseGuards,} from '@nestjs/common';
import {UsersService} from './users.service';
import {UpdateUserInfoDto} from './dto/updateUserInfo.dto';
import {AccessTokenGuard} from '../guards/access-token.guard';
import {Request} from "express";

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {
    }

    @UseGuards(AccessTokenGuard)
    @Get('getInfo')
    async getInfo(@Req() req: Request) {
        const user = await this.usersService.findById(req.user['userId']);
        return user;
    }


    @UseGuards(AccessTokenGuard)
    @Post('updateinfo')
    async updateInfo(@Req() req: Request, @Body() updateUserInfo: UpdateUserInfoDto) {
        const user = await this.usersService.update(req.user['userId'], updateUserInfo);
        return user;
    }

    @UseGuards(AccessTokenGuard)
    @Post('delete')
    async delete(@Req() req: Request,) {
        await this.usersService.deleteUser(req.user['userId']);
        return {successMsg: `User deleted`}
    }
}
