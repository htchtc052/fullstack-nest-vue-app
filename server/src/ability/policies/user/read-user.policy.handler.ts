import {User} from "../../../user/schemas/user.schema";
import {AppAbility} from "../../ability.factory";
import {Action} from "../../../constants/policies.actions";
import {PolicyHandler} from "../../ipolicy-handler.interface";

export class ReadUserPolicyHandler implements PolicyHandler {
    constructor(private userProfile: User) {
    }

    handle(ability: AppAbility) {
        return ability.can(Action.Read, this.userProfile);
    }
}