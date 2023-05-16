import {Provider} from "@nestjs/common";
import {REQUEST} from "@nestjs/core";
import {ReadUserPolicyHandler} from "../../policies/user/read-user.policy.handler";

export const ReadUserPolicyProvider: Provider = {
    provide: ReadUserPolicyHandler,
    inject: [REQUEST],
    useFactory: (request: Request) => {
        // @ts-ignore
        return new ReadUserPolicyHandler(request.userProfile)
    }
}