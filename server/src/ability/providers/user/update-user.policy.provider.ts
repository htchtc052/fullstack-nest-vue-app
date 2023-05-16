import {Provider} from "@nestjs/common";
import {REQUEST} from "@nestjs/core";
import {ReadUserPolicyHandler} from "../../policies/user/read-user.policy.handler";

export const UpdateUserPolicyProvider: Provider = {
    provide: ReadUserPolicyHandler,
    inject: [REQUEST],
    useFactory: (request: Request) => {
        // @ts-ignore
        return new UpdateUserPolicyHandler(request.userProfile)
    }
}