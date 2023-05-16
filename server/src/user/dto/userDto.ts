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
    slug: string;


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

    @Expose()
    description: string

    @Expose({groups: ['readPrivateFields']})
    private: boolean


    @Expose({groups: ['readPrivateFields']})
    hiddenDescription: string

    @Expose()
    isOwner: boolean

}


