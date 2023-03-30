import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';

export type UserDocument = User & Document;

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
}

export const UserSchema = SchemaFactory.createForClass(User);
