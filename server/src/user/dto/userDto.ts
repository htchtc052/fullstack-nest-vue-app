import {Expose, Type} from "class-transformer";
import {ApiProperty} from "@nestjs/swagger";

export class UserDto {
    @ApiProperty({
        description: 'User id'
    })
    @Type(() => String)
    @Expose()
    _id: string;

    @ApiProperty()
    @Expose()
    username: string;

    @ApiProperty()
    @Expose()
    email: string;


    @ApiProperty()
    @Expose()
    firstname: string;


    @ApiProperty()
    @Expose()
    lastname: string;


    @Expose()
    gender: string

    @Expose()
    birthday: Date

}


export class UserRO {
    user: UserDto
}