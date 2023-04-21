import {ValidatorConstraint, ValidatorConstraintInterface} from "class-validator";
import {Injectable} from "@nestjs/common";
import {UserService} from "../user.service";

@ValidatorConstraint({name: 'isSlugAlreadyExist', async: false})
@Injectable()
export class IsEmailAllreadyExists implements ValidatorConstraintInterface {

    constructor(private readonly usersService: UserService) {
    }


    async validate(slug: string): Promise<boolean> {
        return !await this.usersService.findBySlug(slug)
    }


}