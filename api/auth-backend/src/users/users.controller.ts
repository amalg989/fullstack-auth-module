import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('signup')
  async signUp(
    @Body('email') email: string,
    @Body('name') name: string,
    @Body('password') password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.signUp(email, name, password);
    const accessToken = await this.authService.generateToken(user);
    return { access_token: accessToken };
  }

  @Post('signin')
  async signIn(
    @Body('email') email: string,
    @Body('password') password: string,
  ): Promise<{ access_token: string }> {
    return this.authService.signIn(email, password);
  }
}
