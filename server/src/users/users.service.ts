import {Injectable} from '@nestjs/common';
import {CreateUserDto} from './dto/createUser.dto';
import {UpdateUserInfoDto} from './dto/updateUserInfo.dto';
import {InjectModel} from '@nestjs/mongoose';
import {User, UserDocument} from './schemas/user.schema';
import {Model} from 'mongoose';
import {ConfigService} from "@nestjs/config";

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>,
                private configService: ConfigService) {
    }

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

    async update(userId: string, updateUserInfoDto: UpdateUserInfoDto): Promise<User> {
        const user = await this.userModel.findByIdAndUpdate(userId, updateUserInfoDto, {
            new: true,
        });
        return user;
    }

    async remove(id: string): Promise<User> {
        const user = await this.userModel.findByIdAndDelete(id);
        return user;
    }

    async activate(activationToken: string): Promise<Boolean> {
        const user = await this.userModel.findOne({activationToken})
        if (!user) {
            return false;
        }
        user.activatedAt = new Date();
        await user.save();
        return true;
    }

}
