import {Genders} from "../schemas/user.schema";
import {IsEnum, IsOptional} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class UpdateUserInfoDto {
    @ApiProperty({
        name: "User firstname"
    })
    @IsOptional()
    firstname: string;

    @ApiProperty({
        name: "User lastname"
    })
    @IsOptional()
    lastname: string;

    @IsEnum(Genders)
    gender: Genders;

    @IsOptional()
    birthday: Date;
}
