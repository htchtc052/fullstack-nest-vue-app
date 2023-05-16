import {CanActivate, ExecutionContext, Injectable, Scope, Type} from '@nestjs/common';
import {ContextIdFactory, ModuleRef, Reflector} from '@nestjs/core';
import {Request} from 'express';
import {AbilityFactory} from "./ability.factory";
import {CHECK_POLICIES_KEY} from "./check-policies.decorator";
import {PolicyHandler} from "./ipolicy-handler.interface";


@Injectable()
export class PoliciesGuard implements CanActivate {

    constructor(
        private abilityFactory: AbilityFactory,
        private reflector: Reflector,
        private moduleRef: ModuleRef
    ) {
    }

    async canActivate(ctx: ExecutionContext) {
        const policiesHandlersRef = this.reflector.get<Type<PolicyHandler>[]>(
            CHECK_POLICIES_KEY,
            ctx.getHandler()
        ) || [];

        if (policiesHandlersRef.length === 0) return true;

        const contextId = ContextIdFactory.create();
        this.moduleRef.registerRequestByContextId(ctx.switchToHttp().getRequest(), contextId);

        let policyHandlers: PolicyHandler[] = [];
        for (let i = 0; i < policiesHandlersRef.length; i++) {
            const policyHandlerRef = policiesHandlersRef[i];
            const policyScope = this.moduleRef.introspect(policyHandlerRef).scope;

            let policyHandler: PolicyHandler;
            if (policyScope === Scope.DEFAULT) {
                policyHandler = this.moduleRef.get(policyHandlerRef, {strict: false});
            } else {
                policyHandler = await this.moduleRef.resolve(policyHandlerRef, contextId, {strict: false});
            }

            policyHandlers.push(policyHandler);
        }

        const {user} = ctx.switchToHttp().getRequest<Request>();
        if (!user) return false;

        const ability = this.abilityFactory.createForUser(user);
        return policyHandlers.every((handler) => handler.handle(ability));
    }

}