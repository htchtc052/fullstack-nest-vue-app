import {Genders} from "../schemas/user.schema";
import {IsEnum, IsOptional} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class UpdateUserInfoDto {
    @ApiProperty()
    @IsOptional()
    firstname: string;

    @ApiProperty()
    @IsOptional()
    lastname: string;

    @ApiProperty()
    @IsEnum(Genders)
    gender: Genders;

    @ApiProperty()
    @IsOptional()
    birthday: Date;

    @ApiProperty()
    @IsOptional()
    description: string

    @ApiProperty()
    @IsOptional()
    hiddenDescription: string

    @ApiProperty()
    @IsOptional()
    private: boolean

}
