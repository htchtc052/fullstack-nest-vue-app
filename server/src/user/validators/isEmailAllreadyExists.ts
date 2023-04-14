import {ValidatorConstraint, ValidatorConstraintInterface} from "class-validator";
import {Injectable} from "@nestjs/common";
import {UserService} from "../user.service";

@ValidatorConstraint({name: 'isEmailAlreadyExist', async: false})
@Injectable()
export class IsEmailAllreadyExists implements ValidatorConstraintInterface {

    constructor(private readonly usersService: UserService) {
    }


    async validate(email: string): Promise<boolean> {
        return !await this.usersService.findByEmail(email)
    }


}