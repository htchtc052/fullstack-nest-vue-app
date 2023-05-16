import {Type} from "@nestjs/common";
import {PolicyHandler} from "../ipolicy-handler.interface";
import {userPolicies} from "./user";

//export * from './user';

export const policies: Type<PolicyHandler>[] = [
    ...userPolicies,
]