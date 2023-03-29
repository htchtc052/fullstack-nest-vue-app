import {Module} from '@nestjs/common';
import {UsersService} from './users.service';
import {UsersController} from './users.controller';
import {User, UserSchema} from './schemas/user.schema';
import {MongooseModule} from '@nestjs/mongoose';
import {Token, TokenSchema} from "./schemas/token.schema";
import {TokenService} from "./token.service";

@Module({
  imports: [
    MongooseModule.forFeature([{name: User.name, schema: UserSchema}, {name: Token.name, schema: TokenSchema}]),
  ],
  controllers: [UsersController],
  providers: [UsersService, TokenService],
  exports: [UsersService, TokenService],
})
export class UsersModule {
}
