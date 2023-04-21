import {Injectable} from '@nestjs/common';
import {UpdateUserInfoDto} from './dto/updateUserInfo.dto';
import {User} from './schemas/user.schema';
import {CreateUserType} from "./types/createUser.type";
import {EmailService} from "../email/email.service";
import {UserRepository} from "./user.repository";
import {v4 as uuid} from "uuid";

@Injectable()
export class UserService {

    constructor(private emailService: EmailService,
                private usersRepository: UserRepository) {
    }

    async createUser(createUserType: CreateUserType, createActivated?: boolean): Promise<User> {
        if (createActivated) {
            return this.usersRepository.create(createUserType);
        } else {
            const activationToken: string = uuid();
            return this.usersRepository.create({...createUserType, activationToken});
        }

    }

    getUserById(id: string): Promise<User> {
        return this.usersRepository.findById(id);
    }

    getUsers(): Promise<User[]> {
        return this.usersRepository.getUsers();
    }


    findByEmail(email: string): Promise<User> {
        return this.usersRepository.findByEmail(email);
    }

    async findBySlug(slug: string) {
        return this.usersRepository.findBySlug(slug);
    }


    updateUserInfo(user: User, updateUserInfoDto: UpdateUserInfoDto): Promise<User> {
        return this.usersRepository.updateUser(user._id, updateUserInfoDto)
    }

    async deleteUser(userId: string): Promise<void> {
        await this.usersRepository.deleteById(userId)
    }


    async activateUser(activationToken: string): Promise<boolean> {
        const user = await this.usersRepository.findByActivationToken(activationToken)
        if (!user) {
            return false;
        }

        await this.usersRepository.updateUser(user._id, {activatedAt: new Date()})

        return true;
    }


}
