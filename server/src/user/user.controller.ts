import {Body, Controller, Get, Param, Post, Req, UseGuards,} from '@nestjs/common';
import {UserService} from './user.service';
import {UpdateUserInfoDto} from './dto/updateUserInfo.dto';
import {AccessTokenGuard} from '../guards/access-token.guard';
import {Request} from "express";
import {ApiOkResponse, ApiOperation} from "@nestjs/swagger";
import {UserDto, UserRO} from "./dto/userDto";
import {User} from "./schemas/user.schema";
import {plainToClass} from "class-transformer";
import {AuthUser} from "./decorators/authUser.decorator";

@Controller('users')
export class UserController {
    constructor(private readonly usersService: UserService) {
    }


    @ApiOperation({summary: 'Get user data'})
    @ApiOkResponse({type: UserRO})
    @UseGuards(AccessTokenGuard)
    @Get('getUser')
    getUser(@AuthUser() user: User) {
        return this.generateUserRO(user)
    }

    @ApiOperation({summary: 'User user info'})
    @ApiOkResponse({type: UserRO})
    @UseGuards(AccessTokenGuard)
    @Post('updateinfo')
    async updateInfo(@AuthUser() user: User, @Body() updateUserInfo: UpdateUserInfoDto) {
        user = await this.usersService.updateUserInfo(user, updateUserInfo);
        return this.generateUserRO(user)

    }

    @ApiOperation({summary: 'User delete'})
    @ApiOkResponse({type: UserRO})
    @UseGuards(AccessTokenGuard)
    @Post('delete')
    async deleteUser(@Req() req: Request) {
        await this.usersService.deleteUser(req.user['userId']);
        return `User deleted`
    }

    @ApiOperation({summary: 'Activate User'})
    @ApiOkResponse({type: String})
    @Get('activate/:activationToken')
    async activateUser(@Param('activationToken') activationToken: string) {
        if (await this.usersService.activateUser(activationToken))
            return 'User activated'
        else
            return 'Activation link wrong'
    }

    private async generateUserRO(user: User): Promise<UserRO> {
        return {user: plainToClass(UserDto, user, {excludeExtraneousValues: true})};
    }


}
