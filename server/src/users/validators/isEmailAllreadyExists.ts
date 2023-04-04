import {ValidatorConstraint, ValidatorConstraintInterface} from "class-validator";
import {UsersService} from "../users.service";
import {Injectable} from "@nestjs/common";

@ValidatorConstraint({name: 'isEmailAlreadyExist', async: false})
@Injectable()
export class IsEmailAllreadyExists implements ValidatorConstraintInterface {

    constructor(private readonly usersService: UsersService) {
    }


    async validate(email: string): Promise<boolean> {
        const result = await this.usersService.findByEmail(email) ? true : false
        return result;
    }

 
}