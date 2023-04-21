import {ExecutionContext, ForbiddenException, Injectable, UnauthorizedException} from '@nestjs/common';
import {Request} from "express";
import {JwtPayload} from "../types/JwtPayload";
import {JwtService} from "@nestjs/jwt";
import {UserService} from "../../user/user.service";
import {ConfigService} from "@nestjs/config";
import {Reflector} from "@nestjs/core";


@Injectable()
export class JwtAuthGuard {

    constructor(private jwtService: JwtService, private userService: UserService, private configService: ConfigService, private readonly reflector: Reflector) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        const requireAuth = this.reflector.get<boolean>('requireAuth', context.getHandler());


        let user;

        if (token) {
            try {
                const payload: JwtPayload = await this.jwtService.verifyAsync(
                    token,
                    {
                        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
                    }
                );

                // Case 3: The client has a valid token
                user = await this.userService.getUserById(payload.userId);

                if (!user) {
                    throw  new UnauthorizedException(`User not found by jwt paylod userId=${payload.userId}`)
                }


            } catch (err) {
                // Case 2: The client has a token, but it is not valid
                throw new UnauthorizedException('Invalid token');
            }
        }

        if (requireAuth && !user) {
            throw new ForbiddenException('Auth required');
        }
        request["user"] = user
        return true;

    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
