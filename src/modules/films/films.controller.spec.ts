import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { Films } from './entities/films.entity';
import { Users } from 'src/modules/users/entities/users.entity';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AuthRequest } from 'src/auth/models/auth.request';
import { Response } from 'express';

const mockFilmDto: CreateFilmDto = {
  name: 'Test Film',
  year: 2022,
  price: 10,
  description: 'Test Description',
};

const mockFilm: Films = new Films({
  id: '1',
  ...mockFilmDto,
  ownerId: 'user_id',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

describe('FilmsController', () => {
  let filmsController: FilmsController;
  let filmsService: FilmsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        {
          provide: FilmsService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockFilm),
            findAll: jest.fn().mockResolvedValue([mockFilm]),
            findOne: jest.fn().mockResolvedValue(mockFilm),
            update: jest.fn().mockResolvedValue(mockFilm),
            remove: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    filmsController = module.get<FilmsController>(FilmsController);
    filmsService = module.get<FilmsService>(FilmsService);
  });

  it('should be defined', () => {
    expect(filmsController).toBeDefined();
    expect(filmsService).toBeDefined();
  });

  describe('create', () => {
    it('should be able to create a film correctly', async () => {
      const user: Users = { id: 'user_id', name: 'John', email: 'john@example.com', password: 'password', createdAt: '00/00/0000', updatedAt: '00/00/0000' };
      const req: AuthRequest = { user: user } as AuthRequest;
      const res: Response = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;

      await filmsController.create(req, mockFilmDto, res);

      expect(filmsService.create).toHaveBeenCalledWith(user, mockFilmDto);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockFilm);
    });
  });

  describe('findAll', () => {
    it('should return a films list successfully', async () => {
      const res: Response = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;

      await filmsController.findAll(res);

      expect(filmsService.findAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([mockFilm]);
    });
  });

  describe('findOne', () => {
    it('should return a film by id', async () => {
      const filmId = '1';
      const res: Response = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;

      await filmsController.findOne(filmId, res);

      expect(filmsService.findOne).toHaveBeenCalledWith(filmId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockFilm);
    });
  });

  describe('update', () => {
    it('should be able to update a film correctly', async () => {
      const filmId = '1';
      const user: Users = { id: 'user_id', name: 'John', email: 'john@example.com', password: 'password', createdAt: '00/00/0000', updatedAt: '00/00/0000' };
      const req: AuthRequest = { user: user } as AuthRequest;
      const updateFilmDto: UpdateFilmDto = { name: 'Updated Name' };
      const res: Response = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;

      await filmsController.update(filmId, req, updateFilmDto, res);

      expect(filmsService.update).toHaveBeenCalledWith(filmId, user.id, updateFilmDto);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockFilm);
    });
  });

  describe('remove', () => {
    it('should be able to delete a film correctly', async () => {
      const filmId = '1';
      const user: Users = { id: 'user_id', name: 'John', email: 'john@example.com', password: 'password', createdAt: '00/00/0000', updatedAt: '00/00/0000' };
      const req: AuthRequest = { user: user } as AuthRequest;
      const res: Response = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;

      await filmsController.remove(filmId, req, res);

      expect(filmsService.remove).toHaveBeenCalledWith(filmId, user.id);
      expect(res.status).toHaveBeenCalledWith(204);
    });
  });
});
