import {User} from "../../../user/schemas/user.schema";
import {AppAbility} from "../../ability.factory";
import {Action} from "../../../constants/policies.actions";
import {PolicyHandler} from "../../ipolicy-handler.interface";

export class UpdateUserPolicyHandler implements PolicyHandler {
    constructor(private userProfile: User) {
    }

    handle(ability: AppAbility) {
        return ability.can(Action.Update, this.userProfile);
    }
}