import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import {Model} from "mongoose";
import {CreateUserType} from "./types/createUser.type";
import * as argon2 from "argon2";
import {User, UserDocument} from "./schemas/user.schema";

@Injectable()
export class UserRepository {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    }

    async create(createUserType: CreateUserType): Promise<User> {
        const hashedPassword = await argon2.hash(createUserType.password);
        return this.userModel.create({...createUserType, password: hashedPassword});
    }

    findByEmail(email: string): Promise<User> {
        return this.userModel.findOne({email});
    }


    findByActivationToken(activationToken: string): Promise<User> {
        return this.userModel.findOne({activationToken});
    }

    findById(userId: string): Promise<User> {
        return this.userModel.findOne({_id: new mongoose.Types.ObjectId(userId)});
    }

    updateUser(userId: string, payload: any): Promise<User> {
        return this.userModel.findByIdAndUpdate(new mongoose.Types.ObjectId(userId), payload, {
            new: true,
        });

    }

    async deleteById(userId: string): Promise<void> {
        await this.userModel.deleteOne({_id: new mongoose.Types.ObjectId(userId)})
    }


}