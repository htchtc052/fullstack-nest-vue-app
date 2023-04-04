import {Genders} from "../schemas/user.schema";
import {IsEnum} from "class-validator";

export class UpdateUserInfoDto {
    firstname: string;
    lastname: string;
    @IsEnum(Genders)
    gender: Genders;
    birthday: Date;
}
