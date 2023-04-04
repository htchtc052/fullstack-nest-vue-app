import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';

export type UserDocument = User & Document;

export enum Genders {
    NOT_SPECIFIED = 'not_specified',
    FEMALE = 'female',
    MALE = 'male',
}

@Schema()
export class User {

    declare _id: string;
    @Prop({required: true, unique: true})
    username: string;

    @Prop({required: true, unique: true})
    email: string;

    @Prop({required: true})
    password: string;

    @Prop()
    refreshToken: string;

    @Prop()
    activationToken: string;

    @Prop({default: null})
    activatedAt: Date;


    @Prop()
    firstname: string;

    @Prop()
    lastname: string;


    @Prop()
    birthday: Date;


    @Prop({default: Genders.NOT_SPECIFIED})
    gender: Genders;
}

export const UserSchema = SchemaFactory.createForClass(User);
