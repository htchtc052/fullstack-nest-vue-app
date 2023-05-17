import {Provider} from "@nestjs/common";
import {REQUEST} from "@nestjs/core";
import {UpdateUserPolicyHandler} from "../../policies/user/update-user.policy.handler";

export const UpdateUserPolicyProvider: Provider = {
    provide: UpdateUserPolicyHandler,
    inject: [REQUEST],
    useFactory: (request: Request) => {
        // @ts-ignore
        return new UpdateUserPolicyHandler(request.userProfile)
    }
}