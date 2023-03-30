import {Body, Controller, Delete, Param, Patch, UseGuards,} from '@nestjs/common';
import {UsersService} from './users.service';
import {UpdateUserInfoDto} from './dto/updateUserInfo.dto';
import {AccessTokenGuard} from '../guards/access-token.guard';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {
    }


    @UseGuards(AccessTokenGuard)
    @Patch(':userId')
    update(@Param('userId') userId: string, @Body() updateUserInfo: UpdateUserInfoDto) {
        return this.usersService.update(userId, updateUserInfo);
    }

    @UseGuards(AccessTokenGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.usersService.remove(id);
    }
}
