import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

const mockUsersService = {
  signIn: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue('signed-jwt-token'),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signIn', () => {
    it('should return an access token if credentials are valid', async () => {
      mockUsersService.signIn.mockResolvedValue({
        email: 'test@test.com',
        _id: 'userId',
      });

      const result = await service.signIn('test@test.com', 'Password1!');

      expect(mockUsersService.signIn).toHaveBeenCalledWith(
        'test@test.com',
        'Password1!',
      );
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        email: 'test@test.com',
        sub: 'userId',
      });
      expect(result).toEqual({ access_token: 'signed-jwt-token' });
    });

    it('should throw unauthorized exception if credentials are invalid', async () => {
      mockUsersService.signIn.mockRejectedValue(
        new Error('Invalid credentials'),
      );

      await expect(
        service.signIn('test@test.com', 'WrongPassword'),
      ).rejects.toThrow('Invalid credentials');
    });
  });

  describe('generateToken', () => {
    it('should generate a JWT token for the user', async () => {
      const user = { email: 'test@test.com', _id: 'userId' };
      const token = await service.generateToken(user);

      expect(mockJwtService.sign).toHaveBeenCalledWith({
        email: 'test@test.com',
        sub: 'userId',
      });
      expect(token).toBe('signed-jwt-token');
    });
  });
});
