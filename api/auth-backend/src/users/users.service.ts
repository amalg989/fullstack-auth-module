import {
  Injectable,
  BadRequestException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async signUp(email: string, name: string, password: string): Promise<User> {
    if (!this.validatePassword(password)) {
      this.logger.warn(`Invalid password for email: ${email}`);
      throw new BadRequestException(
        'Password must be at least 8 characters long, contain at least one letter, one number, and one special character.',
      );
    }

    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      this.logger.warn(`Attempt to sign up with existing email: ${email}`);
      throw new ConflictException('Email already in use');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.userModel({ email, name, password: hashedPassword });
    this.logger.log(`User signed up with email: ${email}`);
    return user.save();
  }

  async signIn(email: string, password: string): Promise<User> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      this.logger.warn(`Sign in attempt with invalid email: ${email}`);
      throw new BadRequestException('Invalid credentials');
    }
    const isPasswordMatching = await bcrypt.compare(password, user.password);
    if (!isPasswordMatching) {
      this.logger.warn(`Invalid password attempt for email: ${email}`);
      throw new BadRequestException('Invalid credentials');
    }
    this.logger.log(`User signed in with email: ${email}`);
    return user;
  }

  private validatePassword(password: string): boolean {
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  }
}
