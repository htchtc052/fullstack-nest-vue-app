import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import mongoose, {Document} from "mongoose";
import {User} from "../../user/schemas/user.schema";


export type TokenDocument = Token & Document;

@Schema()
export class Token {

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    })
    user: User;


    @Prop({type: String, required: true})
    refreshToken: string;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
