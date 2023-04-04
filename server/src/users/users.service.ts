import {Injectable} from '@nestjs/common';
import {UpdateUserInfoDto} from './dto/updateUserInfo.dto';
import {InjectModel} from '@nestjs/mongoose';
import {User, UserDocument} from './schemas/user.schema';
import * as mongoose from 'mongoose';
import {Model} from 'mongoose';
import {ConfigService} from "@nestjs/config";
import {CreateUserDto} from "./dto/createUser.dto";

@Injectable()
export class UsersService {


    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>,
                private configService: ConfigService) {
    }

    //запросы к юзеру могут понадобится в разных контроллерах, валидациях итп. Пишем их тут, что бы UserModel везде не тащить
    async create(createUserDto: CreateUserDto): Promise<User> {
        return this.userModel.create(createUserDto);
    }


    async findById(id: string): Promise<User> {
        const user = await this.userModel.findById(id);
        return user;
    }

    async findByUsername(username: string): Promise<User> {
        const user = await this.userModel.findOne({username});
        return user;
    }

    async findByEmail(email: string): Promise<User> {
        const user = await this.userModel.findOne({email});
        return user;
    }

    async update(userId: string, updateUserInfoDto: UpdateUserInfoDto): Promise<User> {

        mongoose.set("debug", true)
        console.debug(updateUserInfoDto)
        const user = await this.userModel.findByIdAndUpdate(userId, updateUserInfoDto, {
            new: true,
        });
        mongoose.set("debug", false)

        return user;
    }


    async deleteUser(userId: string): Promise<void> {
        await this.userModel.deleteOne({_id: userId})
        await this.userModel.deleteMany({user: userId})
    }

    //async getInfo(userId: string): Promise<User> {
    // const user: User = await this.findById(userId);
    //  return user;
    //}


    async activate(activationToken: string): Promise<boolean> {
        const user = await this.userModel.findOne({activationToken})
        if (!user) {
            return false;
        }
        user.activatedAt = new Date();
        await user.save();
        return true;
    }


}
