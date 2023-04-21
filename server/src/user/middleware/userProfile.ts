import {Injectable, NestMiddleware, NotFoundException} from "@nestjs/common";
import {UserService} from "../user.service";
import {NextFunction, Request, Response} from "express";

@Injectable()
export class userProfile implements NestMiddleware {
    constructor(private readonly userService: UserService) {
    }

    async use(req: Request, res: Response, next: NextFunction) {
        const userProfile = await this.userService.findBySlug(req.params.slug)

        //const user = req.user;

        if (!userProfile) {
            throw new NotFoundException(`User profile not found`);
        }

        // @ts-ignore
        req.userProfile = userProfile;
        //req.isOwner = user.id === article.userId;
        next();
    }
}