import {Controller, Get, SetMetadata, UseGuards} from "@nestjs/common";
import {UserService} from "./user.service";
import {ApiOkResponse, ApiOperation} from "@nestjs/swagger";
import {UserDto} from "./dto/userDto";
import {plainToClass} from "class-transformer";
import {RolesGuard} from "../auth/guards/rolesGuard";

@Controller('admin')
@UseGuards(RolesGuard)
export class AdminController {
    constructor(private readonly usersService: UserService) {

    }

    @ApiOperation({summary: 'Get users'})
    @ApiOkResponse({})
    @SetMetadata('roles', ['admin'])
    @Get('getUsers')
    async getUsers(): Promise<UserDto[]> {
        const users = await this.usersService.getUsers();
        return users.map(user => plainToClass(UserDto, user, {excludeExtraneousValues: true}));
    }


}
