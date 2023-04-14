import {Injectable} from '@nestjs/common';
import {ConfigService} from "@nestjs/config";
import {User} from "../user/schemas/user.schema";
import {TokensRepository} from "./tokens.repository";
import {TokensDto} from "./dto/tokens.dto";
import {UserService} from "../user/user.service";
import {JwtService} from "@nestjs/jwt";
import {JwtPayload} from "./types/JwtPayload";

@Injectable()
export class TokensService {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
        private usersService: UserService,
        private tokensRepository: TokensRepository) {
    }


    async generateAndSaveTokens(user: User): Promise<TokensDto> {
        const payload: JwtPayload = {userId: user._id}

        const tokens = await this.signTokens(payload);
        await this.tokensRepository.saveRefreshToken(user._id, tokens.refreshToken);
        return tokens;
    }

    async removeToken(refreshToken: string): Promise<void> {
        await this.tokensRepository.deleteRefreshToken(refreshToken)
    }

    async getUserByRefreshToken(refreshToken: string): Promise<User | null> {
        const tokenData = await this.tokensRepository.findByRefreshToken(refreshToken);
        if (!tokenData) {
            return null
        }
        return this.usersService.getUserById(tokenData.user?._id);
    }


    private async signTokens(payload: JwtPayload) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload,
                {
                    secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
                    expiresIn: this.configService.get<number>('JWT_ACCESS_LIFE'),
                },
            ),
            this.jwtService.signAsync(payload,
                {
                    secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
                    expiresIn: this.configService.get<number>('JWT_REFRESH_LIFE'),
                },
            ),
        ]);

        return {
            accessToken,
            refreshToken,
        };
    }

}
