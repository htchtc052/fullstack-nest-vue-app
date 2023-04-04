import {Expose, Type} from "class-transformer";
import {ApiProperty} from "@nestjs/swagger";


export class AuthUserEntity {
    @Type(() => String)
    @Expose()
    _id: string;

    @ApiProperty()
    @Expose()
    email: string;

    @ApiProperty()
    @Expose()
    username: string;

}


/*
import {User} from "../schemas/user.schema";

export class AuthUser {

    constructor(parameters: User) {
        this.userId = parameters._id.toString();
        this.username = parameters.username;
        this.email = parameters.email;
    }

    userId: string;
    username: string;
    email: string;
}
*/