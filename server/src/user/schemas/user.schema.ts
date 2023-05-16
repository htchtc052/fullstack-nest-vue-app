import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';

export type UserDocument = User & Document;


export enum Genders {
    NOT_SPECIFIED = 'not_specified',
    FEMALE = 'female',
    MALE = 'male',
}

export enum Role {
    User = 'user',
    Admin = 'admin',
}

@Schema()
export class User {

    static get modelName() {
        return 'Article'
    }

    declare _id: string;


    @Prop({required: true})
    username: string;

    @Prop({required: true})
    slug: string;

    @Prop({required: true, unique: true})
    email: string;

    @Prop({required: true})
    password: string;


    @Prop()
    firstname: string;

    @Prop()
    lastname: string;

    @Prop()
    birthday: Date;

    @Prop()
    description: string

    @Prop()
    hiddenDescription: string

    @Prop({default: Genders.NOT_SPECIFIED})
    gender: Genders;

    @Prop({type: [String], enum: Object.values(Role), default: [Role.User]})
    roles: Role[];


    @Prop()
    activationToken: string;

    @Prop({default: null})
    activatedAt: Date;

    @Prop({default: false})
    private: boolean;

    isOwner: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
