import {Body, Controller, Get, Param, Put, Request, UseGuards} from "@nestjs/common";
import {UserService} from "./user.service";
import {ApiOkResponse, ApiOperation} from "@nestjs/swagger";
import {User} from "./schemas/user.schema";
import {plainToClass} from "class-transformer";
import {UserDto} from "./dto/userDto";
import {UpdateUserInfoDto} from "./dto/updateUserInfo.dto";
import {Action} from "../constants/policies.actions";
import {AbilityFactory} from "../ability/ability.factory";
import {PoliciesGuard} from "../ability/policies.guard";
import {CheckPolicies} from "../ability/check-policies.decorator";
import {ReadUserPolicyHandler} from "../ability/policies/user/read-user.policy.handler";
import {UpdateUserPolicyHandler} from "../ability/policies/user/update-user.policy.handler";


@Controller('user-profile')
export class UserProfileController {
    constructor(private readonly usersService: UserService, private readonly abilityFactory: AbilityFactory) {

    }

    @ApiOperation({summary: 'Get user profile data'})
    @ApiOkResponse({type: UserDto})
    @UseGuards(PoliciesGuard)
    @CheckPolicies(ReadUserPolicyHandler)
    @Get(':slug')
    async getUserProfile(@Request() req, @Param('slug') slug) {
        const userProfile: User = req.userProfile;

        const ability = this.abilityFactory.createForUser(req.user)


        return plainToClass(UserDto, userProfile, {
            excludeExtraneousValues: true,
            groups: [ability.can(Action.ReadPrivateFiedls, userProfile) ? 'readPrivateFields' : '']
        });
    }

    @ApiOperation({summary: 'Update user profile data'})
    @ApiOkResponse({type: UserDto})
    @UseGuards(PoliciesGuard)
    @CheckPolicies(UpdateUserPolicyHandler)
    @Put('update/:slug')
    async updateUserProfile(@Request() req, @Body() updateUserInfo: UpdateUserInfoDto, @Param('slug') slug) {
        let userProfile: User = req.userProfile;

        userProfile = await this.usersService.updateUserInfo(req.user, updateUserInfo);

        const ability = this.abilityFactory.createForUser(req.user)
        return plainToClass(UserDto, userProfile, {
            excludeExtraneousValues: true,
            groups: [ability.can(Action.ReadPrivateFiedls, userProfile) ? 'readPrivateFields' : '']
        });
    }

}