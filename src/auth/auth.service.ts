import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthDto } from './dto/auth.dto';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<any> {
    // Check if user exists
    const userExists = await this.usersService.findByUsername(
      createUserDto.name,
    );
    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    // Hash password
    const hash = await this.hashData(createUserDto.password);
    const newUser = await this.usersService.create({
      ...createUserDto,
      password: hash,
    });
    // @ts-ignore
    const tokens = await this.getTokens(newUser._id, newUser.username);
    // @ts-ignore
    await this.updateRefreshToken(newUser._id, tokens.refreshToken);
    return tokens;
  }

  async signIn(data: AuthDto) {
    // Check if user exists
    const user = await this.usersService.findByUsername(data.username);
    if (!user) throw new BadRequestException('User does not exist');
    const passwordMatches = await argon2.verify(user.password, data.password);
    if (!passwordMatches)
      throw new BadRequestException('Password is incorrect');
    // @ts-ignore
    const tokens = await this.getTokens(user._id, user.username);
    // @ts-ignore
    await this.updateRefreshToken(user._id, tokens.refreshToken);
    return tokens;
  }

  async logout(userId: string) {
    return this.usersService.update(userId, { refreshToken: null });
  }

  hashData(data: string) {
    return argon2.hash(data);
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.usersService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async getTokens(userId: string, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
