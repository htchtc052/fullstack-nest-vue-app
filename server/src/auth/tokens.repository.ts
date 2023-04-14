import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import mongoose, {Model} from "mongoose";
import {Token, TokenDocument} from "./schema/token.schema";

@Injectable()
export class TokensRepository {
    constructor(@InjectModel(Token.name) private tokenModel: Model<TokenDocument>) {
    }


    async deleteRefreshToken(refreshToken): Promise<void> {
        await this.tokenModel.deleteOne({refreshToken})
    }


    findByRefreshToken(refreshToken): Promise<Token> {
        return this.tokenModel.findOne({refreshToken})
    }

    async saveRefreshToken(userId, refreshToken): Promise<void> {
        const tokenData = await this.tokenModel.findOne({user: new mongoose.Types.ObjectId(userId)})


        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            await tokenData.save();
        } else {
            await this.tokenModel.create({user: userId, refreshToken})
        }

    }

}