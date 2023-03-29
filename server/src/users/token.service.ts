import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {User, UserDocument} from './schemas/user.schema';
import {Model} from 'mongoose';
import {Token, TokenDocument} from "./schemas/token.schema";

@Injectable()
export class TokenService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>,
                @InjectModel(Token.name) private tokenModel: Model<TokenDocument>) {
    }


    async saveRefreshToken(userId, refreshToken) {
        const tokenData = await this.tokenModel.findOne({user: userId})


        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }
        const token = await this.tokenModel.create({user: userId, refreshToken})
        return token;
    }

    async removeToken(refreshToken) {
        const tokenData = await this.tokenModel.deleteOne({refreshToken})
        return tokenData;
    }

    async findToken(refreshToken) {
        const tokenData = await this.tokenModel.findOne({refreshToken})
        return tokenData;
    }

}
