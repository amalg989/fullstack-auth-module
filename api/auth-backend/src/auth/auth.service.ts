import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.signIn(email, password);
    const payload = { email: user.email, sub: user._id };
    const accessToken = this.jwtService.sign(payload);
    this.logger.log(`JWT token generated for email: ${email}`);
    return {
      access_token: accessToken,
    };
  }

  async generateToken(user: User): Promise<string> {
    const payload = { email: user.email, sub: user._id };
    return this.jwtService.sign(payload);
  }
}
