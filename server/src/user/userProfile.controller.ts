import {Controller, Get, NotFoundException, Param, Request} from "@nestjs/common";
import {UserService} from "./user.service";
import {ApiOkResponse, ApiOperation} from "@nestjs/swagger";
import {UserProfileDto} from "./dto/userProfile.dto";
import {User} from "./schemas/user.schema";
import {plainToClass} from "class-transformer";

@Controller('user-profile')
export class UserProfileController {
    constructor(private readonly usersService: UserService) {

    }


    @ApiOperation({summary: 'Get user profile data'})
    @ApiOkResponse({type: UserProfileDto})
    @Get(':slug')
    async getUserProfile(@Request() req, @Param('slug') slug) {
        const user = req.user;

        const userProfile = await this.usersService.findBySlug(slug)

        if (!userProfile) {
            throw  new NotFoundException(`User not found by slug: ${slug}`)
        }
        return this.generateUserProfileResponse(userProfile)
    }

    private async generateUserProfileResponse(userProfile: User): Promise<UserProfileDto> {
        return plainToClass(UserProfileDto, userProfile, {excludeExtraneousValues: true});
    }
}