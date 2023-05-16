import {Type} from "@nestjs/common";
import {PolicyHandler} from "../../ipolicy-handler.interface";
import {ReadUserPolicyHandler} from "./read-user.policy.handler";
import {UpdateUserPolicyHandler} from "./update-user.policy.handler";

//export * from './read-user.policy.handler'

export const userPolicies: Type<PolicyHandler>[] = [
    ReadUserPolicyHandler,
    UpdateUserPolicyHandler
]