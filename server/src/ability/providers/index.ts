import {userPolicyProviders} from "./user";
import {Provider} from "@nestjs/common";

export const aclProviders: Provider[] = [
    ...userPolicyProviders,
]