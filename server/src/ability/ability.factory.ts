import {Injectable} from "@nestjs/common";
import {Role, User, UserDocument} from "../user/schemas/user.schema";
import {Action} from "../constants/policies.actions";
import {Ability, AbilityBuilder, AbilityClass, ExtractSubjectType, InferSubjects} from "@casl/ability";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";

type Subjects = InferSubjects<typeof User> | 'all';

export type AppAbility = Ability<[Action, Subjects]>;


@Injectable()
export class AbilityFactory {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<UserDocument>,
    ) {
    }

    createForUser(user: User | any) {
        const {
            can,
            cannot,
            build
        } = new AbilityBuilder<Ability<[Action, Subjects]>>(Ability as AbilityClass<AppAbility>);


        can(Action.Read, this.userModel, {private: false})

        can(Action.Read, this.userModel, {private: true, _id: user._id.toString()})

        can(Action.ReadPrivateFiedls, this.userModel, {_id: user._id.toString()})

        can(Action.Update, this.userModel, {_id: user._id.toString()})


        if (user?.roles.includes(Role.Admin)) {
            can(Action.Manage, 'all')
        }


        return build({
            detectSubjectType: (item) => {
                return item.constructor as ExtractSubjectType<Subjects>
            }
        });
    }
}