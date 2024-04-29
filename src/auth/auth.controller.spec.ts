import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { UsersService } from 'src/modules/users/users.service';
import { UserPayload } from './models/user-payload';
import { JwtService } from '@nestjs/jwt';
import { UserToken } from './models/user-token';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Users } from 'src/modules/users/entities/users.entity';
import { INestApplication } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let app: INestApplication;

  beforeEach(async () => {
    const mockAuthService = {
      login: jest.fn((user) => {
        const payload: UserPayload = { sub: user.id, email: user.email, name: user.name };
        const token: UserToken = { accessToken: 'mockAccessToken' };
        return token;
      }),
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        UsersService,
        JwtService,
        LocalAuthGuard,
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: getRepositoryToken(Users), // Assuming Users is your TypeORM entity name
          useValue: {}, // You can mock this if needed
        },
      ],
      imports: [
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '3600s' },
        }),
      ],
    }).compile();

    controller = moduleRef.get<AuthController>(AuthController);
    app = moduleRef.createNestApplication();

    try {
      await app.init();
    } catch (error) {
      console.error('Error initializing app:', error);
    }
  });

  afterEach(async () => {
    if (app) {
      try {
        await app.close();
      } catch (error) {
        console.error('Error closing app:', error);
      }
    }
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});