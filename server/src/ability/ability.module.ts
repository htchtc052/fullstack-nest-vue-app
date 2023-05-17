import {Module} from "@nestjs/common";
import {AbilityFactory} from "./ability.factory";
import {MongooseModule} from "@nestjs/mongoose";
import {User, UserSchema} from "../user/schemas/user.schema";
import {aclProviders} from "./providers";
import {policies} from "./policies";

@Module({
    controllers: [],
    providers: [AbilityFactory, ...aclProviders],
    exports: [AbilityFactory, ...policies],
    imports: [
        MongooseModule.forFeature([{name: User.name, schema: UserSchema}]),
    ],
})
export class AbilityModule {

}