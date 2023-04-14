import {UserDto} from "../../user/dto/userDto";
import {TokensDto} from "../dto/tokens.dto";

export class AuthRO {
    user: UserDto;
    tokens: TokensDto;
}