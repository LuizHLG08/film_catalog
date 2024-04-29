import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Users } from './entities/users.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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

describe('UsersService', () => {
  let usersService: UsersService;
  let userRepository: Repository<Users>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(Users),
          useValue: {
            save: jest.fn().mockResolvedValue(mockUser),
            find: jest.fn().mockResolvedValue([mockUser]),
            findOne: jest.fn().mockResolvedValue(mockUser),
            update: jest.fn().mockResolvedValue(true),
            delete: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<Users>>(getRepositoryToken(Users));
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('create', () => {
    it('should be able to create users correctly', async () => {
      const createdUser = await usersService.create(mockUserDto);

      expect(userRepository.save).toHaveBeenCalledWith(mockUserDto);
      expect(createdUser).toEqual({
        ...mockUser,
        password: undefined,
      });
    });
  });

  describe('findAll', () => {
    it('should return a users list successfully', async () => {
      const usersList = await usersService.findAll();

      expect(userRepository.find).toHaveBeenCalled();
      expect(usersList).toEqual([{
        ...mockUser,
        password: undefined,
      }]);
    });
  });

  describe('update', () => {
    it('should be able to update users correctly', async () => {
      const updateUserDto: UpdateUserDto = { name: 'Updated Name' };
  
      const mockUpdatedUser = { ...mockUser, ...updateUserDto };
      userRepository.update = jest.fn().mockResolvedValue({ affected: 1 });
      userRepository.findOne = jest.fn().mockResolvedValue(mockUpdatedUser);
  
      const updatedUser = await usersService.update('1', updateUserDto);
  
      expect(userRepository.update).toHaveBeenCalledWith({ id: '1' }, updateUserDto);
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(updatedUser).toEqual({
        ...mockUpdatedUser,
        password: undefined,
      });
    });
  
    it('should throw an error when user is not found or not updated', async () => {
      userRepository.update = jest.fn().mockResolvedValue({ affected: 0 });
  
      await expect(usersService.update('1', {} as UpdateUserDto)).rejects.toThrowError('User not found or not updated.');
    });
  });

  describe('remove', () => {
    it('should be able to delete users correctly', async () => {
      await usersService.remove('1');

      expect(userRepository.delete).toHaveBeenCalledWith('1');
    });
  });
});
