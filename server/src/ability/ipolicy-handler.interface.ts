import {AppAbility} from "./ability.factory";

export interface PolicyHandler {
    handle(ability: AppAbility): boolean;
}