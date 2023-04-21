import {Body, Controller, Get, Param, Post, Request} from '@nestjs/common';

import {UserService} from './user.service';
import {UpdateUserInfoDto} from './dto/updateUserInfo.dto';
import {ApiOkResponse, ApiOperation} from "@nestjs/swagger";
import {UserDto} from "./dto/userDto";
import {User} from "./schemas/user.schema";
import {plainToClass} from "class-transformer";
import {requireAuth} from "../auth/decorators/requireAuth.decorator";

@Controller('users')
export class UserController {
    constructor(private readonly usersService: UserService) {
    }


    @ApiOperation({summary: 'Get user data'})
    @ApiOkResponse({type: UserDto})

    @requireAuth()
    @Get('getUser')
    getUser(@Request() req) {
        const user = req.user
        return this.generateUserResponse(user)
    }

    @ApiOperation({summary: 'User user info'})
    @ApiOkResponse({type: UserDto})
    @requireAuth()
    @Post('updateinfo')
    async updateInfo(@Request() req, @Body() updateUserInfo: UpdateUserInfoDto) {
        const user = await this.usersService.updateUserInfo(req.user, updateUserInfo);
        return this.generateUserResponse(user)

    }

    @ApiOperation({summary: 'User delete'})
    @ApiOkResponse({type: UserDto})
    @requireAuth()
    @Post('delete')
    async deleteUser(@Request() req) {
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

    private async generateUserResponse(user: User): Promise<UserDto> {
        return plainToClass(UserDto, user, {excludeExtraneousValues: true});
    }
}
