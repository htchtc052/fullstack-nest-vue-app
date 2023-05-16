import {Body, Controller, ForbiddenException, Get, Post, Request, SetMetadata, UseGuards} from "@nestjs/common";
import {UserService} from "./user.service";
import {ApiBadRequestResponse, ApiOkResponse, ApiOperation} from "@nestjs/swagger";
import {UserDto} from "./dto/userDto";
import {plainToClass} from "class-transformer";
import {RolesGuard} from "../auth/guards/rolesGuard";
import {AdminCreateUserDto} from "./dto/adminCreateUser.dto";
import {AbilityFactory} from "../ability/ability.factory";
import {Action} from "../constants/policies.actions";
import {User} from "./schemas/user.schema";

@Controller('admin')
@UseGuards(RolesGuard)
export class AdminController {
    constructor(private readonly usersService: UserService, private readonly abilityFactory: AbilityFactory) {

    }

    @ApiOperation({summary: 'Get users'})
    @ApiOkResponse({})
    @SetMetadata('roles', ['admin'])
    @Get('getUsers')
    async getUsers(): Promise<UserDto[]> {
        const users = await this.usersService.getUsers();
        return users.map(user => plainToClass(UserDto, user, {excludeExtraneousValues: true}));
    }

    @ApiOperation({summary: 'Admin create user'})
    @ApiOkResponse({})
    @ApiBadRequestResponse()
    //@SetMetadata('roles', ['admin'])
    @Post('createUser')
    async createUser(@Request() req, @Body() adminCreateUserDto: AdminCreateUserDto): Promise<UserDto> {
        const user = req.user;


        const ability = this.abilityFactory.createForUser(user)

        const isAllowed = ability.can(Action.Create, User);

        if (!isAllowed) {
            throw  new ForbiddenException(`Don't have user creation access`);
        }

        const currentUser = await this.usersService.createUser(adminCreateUserDto, {createActivated: true})
        return plainToClass(UserDto, currentUser, {excludeExtraneousValues: true})
    }
}
