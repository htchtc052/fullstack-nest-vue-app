import {Controller, Get, Param, Post, Request} from '@nestjs/common';

import {UserService} from './user.service';
import {ApiOkResponse, ApiOperation} from "@nestjs/swagger";
import {UserDto} from "./dto/userDto";
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

        return plainToClass(UserDto, user, {excludeExtraneousValues: true, groups: ['isOwner']});
    }

    //@ApiOperation({summary: 'User user info'})
    //@ApiOkResponse({type: UserDto})
    //@requireAuth()
    //@Post('updateinfo')
    //async updateInfo(@Request() req, @Body() updateUserInfo: UpdateUserInfoDto): Promise<UserDto> {
    //const user = await this.usersService.updateUserInfo(req.user, updateUserInfo);

    // console.log(user);

    //   return plainToClass(UserDto, user, {excludeExtraneousValues: true, groups: ['isOwner', 'owner']});
    // }

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

}
