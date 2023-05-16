import {Injectable, NestMiddleware, NotFoundException} from "@nestjs/common";
import {UserService} from "../user.service";
import {NextFunction, Request, Response} from "express";

@Injectable()
export class GetUserProfileMiddleware implements NestMiddleware {
    constructor(private readonly userService: UserService) {
    }

    async use(req: Request, res: Response, next: NextFunction) {

        const slug = req.params.slug;
        if (!slug) {
            throw new NotFoundException(`Missing slug`);

        }
        const userProfile = await this.userService.findBySlug(slug)


        if (!userProfile) {
            throw new NotFoundException(`User profile not found by slug=${slug}`);
        }

        // @ts-ignore
        req.userProfile = userProfile;
        //req.isOwner = user.id === article.userId;
        next();
    }
}