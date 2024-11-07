import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcryptjs';

const mockUserModel = {
  findOne: jest.fn(),
  save: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signUp', () => {
    it('should hash the password and save the user', async () => {
      mockUserModel.findOne.mockResolvedValue(null);
      mockUserModel.save.mockResolvedValue({
        email: 'test@test.com',
        name: 'Test User',
      });
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');

      const result = await service.signUp(
        'test@test.com',
        'Test User',
        'Password1!',
      );

      expect(bcrypt.hash).toHaveBeenCalledWith('Password1!', 10);
      expect(mockUserModel.save).toHaveBeenCalled();
      expect(result).toEqual({ email: 'test@test.com', name: 'Test User' });
    });

    it('should throw conflict exception if email is already in use', async () => {
      mockUserModel.findOne.mockResolvedValue({ email: 'test@test.com' });

      await expect(
        service.signUp('test@test.com', 'Test User', 'Password1!'),
      ).rejects.toThrow('Email already in use');
    });

    it('should throw bad request exception if password does not meet requirements', async () => {
      await expect(
        service.signUp('test@test.com', 'Test User', 'pass'),
      ).rejects.toThrow(
        'Password must be at least 8 characters long, contain at least one letter, one number, and one special character.',
      );
    });
  });

  describe('signIn', () => {
    it('should return the user if credentials are valid', async () => {
      mockUserModel.findOne.mockResolvedValue({
        email: 'test@test.com',
        password: 'hashedPassword',
      });
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result = await service.signIn('test@test.com', 'Password1!');

      expect(bcrypt.compare).toHaveBeenCalledWith(
        'Password1!',
        'hashedPassword',
      );
      expect(result).toEqual({
        email: 'test@test.com',
        password: 'hashedPassword',
      });
    });

    it('should throw bad request exception if credentials are invalid', async () => {
      mockUserModel.findOne.mockResolvedValue(null);

      await expect(
        service.signIn('test@test.com', 'Password1!'),
      ).rejects.toThrow('Invalid credentials');
    });
  });
});
