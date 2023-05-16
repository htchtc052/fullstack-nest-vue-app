import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {Reflector} from "@nestjs/core";
import {Observable} from "rxjs";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const roles = this.reflector.get<string[]>('roles', context.getHandler());

        if (!roles) {
            return true;
        }

        const req = context.switchToHttp().getRequest();
        const user = req.user;

        if (!user) return false;


        return user.roles.some((role) => roles.indexOf(role) > -1);

    }
}