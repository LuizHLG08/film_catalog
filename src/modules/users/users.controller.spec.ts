import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Users } from './entities/users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'express';
import { AuthRequest } from 'src/auth/models/auth.request'; 

const mockUserDto: CreateUserDto = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123',
};

const mockUser: Users = new Users({
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123',
});

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockUser),
            findAll: jest.fn().mockResolvedValue([mockUser]),
            update: jest.fn().mockResolvedValue(mockUser),
            remove: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
    expect(usersService).toBeDefined();
  });

  describe('create', () => {
    it('should be able to create users correctly', async () => {
      const res: Response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      await usersController.create(mockUserDto, res);

      expect(usersService.create).toHaveBeenCalledWith(mockUserDto);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('findAll', () => {
    it('should return a users list successfully', async () => {
      const res: Response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      await usersController.findAll(res);

      expect(usersService.findAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([mockUser]);
    });
  });

  describe('update', () => {
    it('should be able to update users correctly', async () => {
      const req: AuthRequest = { user: mockUser } as AuthRequest;
      const updateUserDto: UpdateUserDto = { name: 'Updated Name' };

      const res: Response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      await usersController.update(req, updateUserDto, res);

      expect(usersService.update).toHaveBeenCalledWith(req.user.id, updateUserDto);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('delete', () => {
    it('should be able to delete users correctly', async () => {
      const req: AuthRequest = { user: mockUser } as AuthRequest;
      const res: Response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      await usersController.remove(req, res);

      expect(usersService.remove).toHaveBeenCalledWith(req.user.id);
      expect(res.status).toHaveBeenCalledWith(204);
    });
  });
});
